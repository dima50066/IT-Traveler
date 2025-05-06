import { Request, Response } from "express";
import * as pointService from "../services/points";

export const getPoints = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const points = await pointService.getPointsByUser(userId);
  res.json(points);
};

export const createPoint = async (req: Request, res: Response) => {
  const userId = req.auth?.sub!;
  const data = { ...req.body, userId };
  await pointService.createPoint(data);
  res.json({ message: "Point created successfully" });
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
