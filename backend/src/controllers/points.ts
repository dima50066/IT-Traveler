import { Request, Response } from "express";
import * as pointService from "../services/points";
import { saveFileToCloudinary } from "../utils/cloudinary";
import { getPlacePhotoByCoordinates } from "../utils/googlePlaces";
import { searchPlacesByText } from "../services/points";
import redisClient from "../utils/redis";
import { Point } from "../db/models/Point"; // для пошуку попередньої точки
import { getDistanceDuration } from "../services/points"; // нова функція

export const listPoints = async (req: Request, res: Response) => {
  try {
    if (!req.trip) {
      console.error(
        "❌ [GET /points/list] req.trip is missing — check middleware"
      );
      return res
        .status(400)
        .json({ message: "Missing trip context from middleware" });
    }

    const tripId = req.trip._id.toString();
    const status = req.query.status as string | undefined;
    const points = await pointService.getPointsByTrip(tripId, status);

    res.json(points);
  } catch (err: any) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message || err.toString(),
    });
  }
};

export const createPoint = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const tripId = req.trip!._id.toString();
  const {
    title,
    notes,
    coordinates,
    dayNumber,
    orderIndex,
    transportMode,
    category,
  } = req.body;

  let imageUrl: string | undefined;

  if (req.file) {
    const uploadResult = await saveFileToCloudinary(
      req.file.path,
      "IT-Traveler"
    );
    imageUrl = uploadResult.secure_url;
  } else if (coordinates?.lat && coordinates?.lng) {
    imageUrl = await getPlacePhotoByCoordinates(
      coordinates.lat,
      coordinates.lng,
      title
    );
  }

  let distance: number | undefined;
  let duration: number | undefined;

  // 🧠 Обчислюємо маршрут, якщо є попередня точка і транспорт
  if (typeof orderIndex === "number" && orderIndex > 0 && transportMode) {
    const prevPoint = await Point.findOne({
      tripId,
      orderIndex: orderIndex - 1,
    });
    if (prevPoint?.coordinates && coordinates) {
      try {
        const routeData = await getDistanceDuration(
          prevPoint.coordinates,
          coordinates,
          transportMode
        );
        distance = routeData.distance;
        duration = routeData.duration;
      } catch (err) {
        console.warn("❗ Failed to calculate route distance/duration:", err);
      }
    }
  }

  const data = {
    title,
    notes,
    coordinates,
    dayNumber,
    orderIndex,
    transportMode,
    category,
    img: imageUrl,
    userId,
    tripId,
    distance,
    duration,
  };

  const created = await pointService.createPoint(data);
  await Promise.all([
    redisClient.del(`points:${tripId}:wishlist`),
    redisClient.del(`points:${tripId}:visited`),
    redisClient.del(`points:${tripId}:all`),
  ]);
  res.json(created);
};

export const updatePoint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tripId = req.trip!._id.toString();
  const {
    title,
    notes,
    coordinates,
    dayNumber,
    orderIndex,
    transportMode,
    category,
    costFromPrevious,
  } = req.body;

  const updatedData: any = {
    title,
    notes,
    coordinates,
    dayNumber,
    orderIndex,
    transportMode,
    category,
    costFromPrevious,
  };

  if (req.file) {
    const uploadResult = await saveFileToCloudinary(
      req.file.path,
      "IT-Traveler"
    );
    updatedData.img = uploadResult.secure_url;
  } else if (coordinates?.lat && coordinates?.lng) {
    const newImage = await getPlacePhotoByCoordinates(
      coordinates.lat,
      coordinates.lng,
      title
    );
    if (newImage) {
      updatedData.img = newImage;
    }
  }

  // 🧠 Перерахунок distance/duration при оновленні
  if (
    typeof orderIndex === "number" &&
    orderIndex > 0 &&
    transportMode &&
    coordinates
  ) {
    const prevPoint = await Point.findOne({
      tripId,
      orderIndex: orderIndex - 1,
    });
    if (prevPoint?.coordinates) {
      try {
        const { distance, duration } = await getDistanceDuration(
          prevPoint.coordinates,
          coordinates,
          transportMode
        );
        updatedData.distance = distance;
        updatedData.duration = duration;
      } catch (err) {
        console.warn("❗ Failed to recalculate route:", err);
      }
    }
  }

  const updated = await pointService.updatePointById(id, updatedData);
  await Promise.all([
    redisClient.del(`points:${tripId}:wishlist`),
    redisClient.del(`points:${tripId}:visited`),
    redisClient.del(`points:${tripId}:all`),
  ]);

  if (!updated) {
    return res.status(404).json({ message: "Point not found" });
  }

  res.json({ message: "Point updated successfully", point: updated });
};

export const deletePoint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tripId = req.trip!._id.toString();

  const deleted = await pointService.deletePointById(id);
  try {
    await Promise.all([
      redisClient.del(`points:${tripId}:wishlist`),
      redisClient.del(`points:${tripId}:visited`),
      redisClient.del(`points:${tripId}:all`),
    ]);
  } catch (err) {
    console.warn(`[Redis] Failed to delete cache for trip ${tripId}`, err);
  }

  if (!deleted) {
    return res.status(404).json({ message: "Point not found" });
  }

  res.json({ message: "Point deleted successfully" });
};

export const searchPlaces = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Missing search query." });
  }

  try {
    const results = await searchPlacesByText(query);
    res.json(results);
  } catch (err) {
    console.error("[Places] Search failed:", err);
    res.status(500).json({ message: "Failed to search places." });
  }
};

export const reorderPoints = async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const { orderedPointIds } = req.body;

  if (!Array.isArray(orderedPointIds) || orderedPointIds.length === 0) {
    return res.status(400).json({ message: "Invalid point ID list" });
  }

  const points = await Point.find({ _id: { $in: orderedPointIds }, tripId });

  const pointMap = new Map(points.map((p) => [p._id.toString(), p]));

  const updates: any[] = [];

  for (let i = 0; i < orderedPointIds.length; i++) {
    const currentId = orderedPointIds[i];
    const prevId = orderedPointIds[i - 1];

    const point = pointMap.get(currentId);
    const prevPoint = pointMap.get(prevId);

    if (!point) continue;

    const update: any = {
      orderIndex: i,
    };

    // якщо є попередня точка і mode + координати
    if (
      prevPoint &&
      point.coordinates &&
      point.transportMode &&
      prevPoint.coordinates
    ) {
      try {
        const result = await getDistanceDuration(
          prevPoint.coordinates,
          point.coordinates,
          point.transportMode
        );
        update.distance = result.distance;
        update.duration = result.duration;
      } catch (err) {
        console.warn(`❗ Failed to get route for ${point._id}:`, err);
      }
    }

    await Point.findByIdAndUpdate(currentId, update);
  }

  await Promise.all([
    redisClient.del(`points:${tripId}:wishlist`),
    redisClient.del(`points:${tripId}:visited`),
    redisClient.del(`points:${tripId}:all`),
  ]);

  res.json({ message: "Points reordered successfully" });
};
