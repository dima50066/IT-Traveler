import { Request, Response } from "express";
import * as pointService from "../services/points";
import { saveFileToCloudinary } from "../utils/cloudinary";
import { getPlacePhotoByCoordinates } from "../utils/googlePlaces";
import { searchPlacesByText } from "../services/points";
import redisClient from "../utils/redis";

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
  const { title, description, coordinates } = req.body;

  let imageUrl: string | undefined;

  if (req.file) {
    const uploadResult = await saveFileToCloudinary(
      req.file.path,
      "IT-Traveler"
    );
    imageUrl = uploadResult.secure_url;
  } else if (coordinates?.length === 2) {
    const [lng, lat] = coordinates;
    imageUrl = await getPlacePhotoByCoordinates(lat, lng, description);
  }

  const data = {
    title,
    description,
    coordinates,
    img: imageUrl,
    userId,
    tripId,
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
  const { title, description, coordinates } = req.body;

  let updatedData: any = {
    title,
    description,
    coordinates,
  };

  if (req.file) {
    const uploadResult = await saveFileToCloudinary(
      req.file.path,
      "IT-Traveler"
    );
    updatedData.img = uploadResult.secure_url;
  } else if (coordinates?.length === 2) {
    const [lng, lat] = coordinates;
    const newImage = await getPlacePhotoByCoordinates(lat, lng, description);
    if (newImage) {
      updatedData.img = newImage;
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

  res.json({ message: "Point updated successfully" });
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
