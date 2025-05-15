import { Request, Response } from "express";
import * as pointService from "../services/points";
import { saveFileToCloudinary } from "../utils/cloudinary";
import { getPlacePhotoByCoordinates } from "../utils/googlePlaces";
import { searchPlacesByText } from "../services/points";
import redisClient from "../utils/redis";

export const getPoints = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const status = req.query.status as string | undefined;
  const points = await pointService.getPointsByUser(userId, status);
  res.json(points);
};

export const createPoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
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
  };

  const created = await pointService.createPoint(data);
  await redisClient.del(`points:${userId}`);

  res.json(created);
};

export const updatePoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const { id } = req.params;
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

  const updated = await pointService.updateUserPointById(
    userId,
    id,
    updatedData
  );
  await redisClient.del(`points:${userId}`);

  if (!updated) {
    return res.status(404).json({ message: "Point not found" });
  }

  res.json({ message: "Point updated successfully" });
};

export const deletePoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const { id } = req.params;
  const deleted = await pointService.deleteUserPointById(userId, id);
  try {
    await redisClient.del(`points:${userId}`);
  } catch (err) {
    console.warn(`[Redis] Failed to delete cache for user ${userId}`, err);
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
