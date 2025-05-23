import { Request, Response, NextFunction } from "express";
import { Trip } from "../db/models/Trip";
import mongoose from "mongoose";

export const checkTripAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new Error("Missing user ID in request"));
    }

    let rawTripId: string | undefined;

    if (typeof req.query?.tripId === "string") {
      rawTripId = req.query.tripId;
    } else if (typeof req.body?.tripId === "string") {
      rawTripId = req.body.tripId;
    } else if (typeof req.params?.tripId === "string") {
      rawTripId = req.params.tripId;
    }

    if (!rawTripId) {
      return next(new Error("Missing tripId"));
    }

    if (!mongoose.Types.ObjectId.isValid(rawTripId)) {
      return next(new Error("Invalid tripId"));
    }

    const trip = await Trip.findById(rawTripId);
    if (!trip) {
      return next(new Error("Trip not found"));
    }

    const isOwner = trip.userId === userId;
    const isCollaborator = trip.collaborators.includes(userId);

    if (!isOwner && !isCollaborator) {
      return next(new Error("Access denied to this trip"));
    }

    req.trip = trip;
    next();
  } catch (err) {
    next(err);
  }
};
