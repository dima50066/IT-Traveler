import { Request, Response } from "express";
import * as pointService from "../services/points";
import { saveFileToCloudinary } from "../utils/cloudinary";
import { getPlacePhotoByCoordinates } from "../utils/googlePlaces";
import { searchPlacesByText } from "../services/points";
import redisClient from "../utils/redis";
import { Point } from "../db/models/Point";
import { getDistanceDuration } from "../services/points";

export const listPoints = async (req: Request, res: Response) => {
  try {
    if (!req.trip) {
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
    description,
    notes = [],
    coordinates,
    dayNumber,
    transportMode,
    category,
  } = req.body;

  const notesWithMeta = Array.isArray(notes)
    ? notes.map((n) => ({
        text: n.text || "",
        authorId: userId,
        createdAt: new Date(),
      }))
    : [];

  const lastPoint = await Point.findOne({ tripId }).sort({ orderIndex: -1 });
  const orderIndex = (lastPoint?.orderIndex ?? -1) + 1;

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
  if (lastPoint?.coordinates && coordinates && transportMode) {
    try {
      const routeData = await getDistanceDuration(
        lastPoint.coordinates,
        coordinates,
        transportMode
      );
      distance = routeData.distance;
      duration = routeData.duration;
    } catch (err) {
      console.error(err);
    }
  }

  const data = {
    title,
    description,
    notes: notesWithMeta,
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
    description,
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
    description,
    coordinates,
    dayNumber,
    orderIndex,
    transportMode,
    category,
    costFromPrevious,
  };

  if (Array.isArray(notes)) {
    updatedData.notes = notes.map((n) => ({
      text: n.text || "",
      authorId: req.user?.id,
      createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
    }));
  }

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
        console.error(err);
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
    console.error(err);
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
    console.error(err);
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

  for (let i = 0; i < orderedPointIds.length; i++) {
    const currentId = orderedPointIds[i];
    const prevId = orderedPointIds[i - 1];

    const point = pointMap.get(currentId);
    const prevPoint = pointMap.get(prevId);

    if (!point) continue;

    const update: any = { orderIndex: i };

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
        console.error(err);
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

export const addNoteToPoint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, tripId: tripIdFromBody } = req.body;

  if (!req.trip && !tripIdFromBody) {
    return res.status(400).json({ message: "Missing tripId" });
  }

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: "Note text is required" });
  }

  const newNote = {
    text: text.trim(),
    createdAt: new Date(),
    authorId: req.user?.id,
  };

  try {
    const updated = await Point.findByIdAndUpdate(
      id,
      { $push: { notes: newNote } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Point not found" });
    }

    res.json({ message: "Note added successfully", point: updated });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getPointNotes = async (req: Request, res: Response) => {
  const { id } = req.params;
  const point = await Point.findById(id);

  if (!point) {
    return res.status(404).json({ message: "Point not found" });
  }

  res.json(point.notes ?? []);
};

export const deleteNoteFromPoint = async (req: Request, res: Response) => {
  const { pointId, noteIndex } = req.params;
  const point = await Point.findById(pointId);

  if (!point) {
    return res.status(404).json({ message: "Point not found" });
  }

  const index = parseInt(noteIndex, 10);

  if (
    !Array.isArray(point.notes) ||
    isNaN(index) ||
    index < 0 ||
    index >= point.notes.length
  ) {
    return res.status(400).json({ message: "Invalid note index" });
  }

  point.notes.splice(index, 1);
  await point.save();

  res.json({ message: "Note deleted", notes: point.notes });

  point.notes.splice(Number(noteIndex), 1);
  await point.save();

  res.json({ message: "Note deleted", notes: point.notes });
};
