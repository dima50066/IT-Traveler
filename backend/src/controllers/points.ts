import { Request, Response } from "express";
import * as pointService from "../services/points";
import { saveFileToCloudinary } from "../utils/cloudinary";
import { getPlacePhotoByCoordinates } from "../utils/googlePlaces";

export const getPoints = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const points = await pointService.getPointsByUser(userId);
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
    imageUrl = await getPlacePhotoByCoordinates(lat, lng);
  }

  const data = {
    title,
    description,
    coordinates,
    img: imageUrl,
    userId,
  };

  const created = await pointService.createPoint(data);
  res.json(created);
};

export const updatePoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const { id } = req.params;
  const updated = await pointService.updateUserPointById(userId, id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Point not found" });
  }
  res.json({ message: "Point updated successfully" });
};

export const deletePoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const { id } = req.params;
  const deleted = await pointService.deleteUserPointById(userId, id);
  if (!deleted) {
    return res.status(404).json({ message: "Point not found" });
  }
  res.json({ message: "Point deleted successfully" });
};
