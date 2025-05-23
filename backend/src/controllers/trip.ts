import { Request, Response } from "express";
import * as tripService from "../services/trip";
import redisClient from "../utils/redis";

export const getTrips = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const trips = await tripService.getTripsByUser(userId);
  res.json(trips);
};

export const createTrip = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const data = {
    ...req.body,
    userId,
  };

  const created = await tripService.createTrip(data);
  await redisClient.del(`trips:${userId}`);
  res.status(201).json(created);
};

export const updateTrip = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id } = req.params;
  const updated = await tripService.updateTripById(userId, id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Trip not found" });
  }

  await redisClient.del(`trips:${userId}`);
  res.json({ message: "Trip updated successfully", trip: updated });
};

export const deleteTrip = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id } = req.params;
  const deleted = await tripService.deleteTripById(userId, id);

  if (!deleted) {
    return res.status(404).json({ message: "Trip not found" });
  }

  await Promise.all([
    redisClient.del(`trips:${userId}`),
    redisClient.del(`points:${id}:wishlist`),
    redisClient.del(`points:${id}:visited`),
    redisClient.del(`points:${id}:all`),
  ]);
  res.json({ message: "Trip deleted successfully" });
};

export const inviteUser = async (req: Request, res: Response) => {
  const { id: tripId } = req.params;
  const { userId: collaboratorId } = req.body;

  if (!collaboratorId) {
    return res.status(400).json({ message: "Missing userId to invite" });
  }

  const updatedTrip = await tripService.inviteCollaborator(
    tripId,
    collaboratorId
  );
  if (!updatedTrip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  res.json({ message: "User invited successfully", trip: updatedTrip });
};
