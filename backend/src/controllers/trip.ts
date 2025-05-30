import { Request, Response } from "express";
import * as tripService from "../services/trip";
import { getUserById } from "../services/auth";
import redisClient from "../utils/redis";
import { getSocketInstance } from "../utils/socket";

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
    redisClient.del(`chat:trip:${id}`),
  ]);
  res.json({ message: "Trip deleted successfully" });
};

export const inviteUser = async (req: Request, res: Response) => {
  const { id: tripId } = req.params;
  const { userId: collaboratorId } = req.body;
  const ownerId = req.user?.id!;

  if (!collaboratorId) {
    return res.status(400).json({ message: "Missing userId to invite" });
  }

  const trip = await tripService.getTripById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  if (trip.userId !== ownerId) {
    return res.status(403).json({ message: "Only owner can invite" });
  }

  const user = await getUserById(collaboratorId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedTrip = await tripService.inviteCollaborator(
    tripId,
    collaboratorId
  );
  if (!updatedTrip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const io = getSocketInstance();
  io.to(collaboratorId).emit("notification", {
    message: `You have been invited to the trip: ${updatedTrip.title}`,
    tripId,
  });

  res.json({ message: "User invited successfully", trip: updatedTrip });
};

export const addTodo = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Missing todo text" });

  const updated = await tripService.addTodoItem(tripId, userId, text);
  if (!updated) return res.status(404).json({ message: "Trip not found" });

  res.json(updated.todoList);
};

export const toggleTodo = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId, todoId } = req.params;

  const updated = await tripService.toggleTodoItem(tripId, userId, todoId);
  if (!updated)
    return res.status(404).json({ message: "Trip or todo not found" });

  res.json(updated.todoList);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId, todoId } = req.params;

  const updated = await tripService.deleteTodoItem(tripId, userId, todoId);
  if (!updated)
    return res.status(404).json({ message: "Trip or todo not found" });

  res.json(updated.todoList);
};

export const updateTodo = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId, todoId } = req.params;
  const updated = await tripService.updateTodoItem(
    tripId,
    userId,
    todoId,
    req.body
  );
  if (!updated)
    return res.status(404).json({ message: "Trip or todo not found" });
  res.json(updated.todoList);
};

export const reorderTodos = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId } = req.params;
  const { todoIds } = req.body;
  const updated = await tripService.reorderTodoList(tripId, userId, todoIds);
  if (!updated) return res.status(404).json({ message: "Trip not found" });
  res.json(updated.todoList);
};

export const markAllTodos = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId } = req.params;
  const { done } = req.body;
  const updated = await tripService.markAllTodos(tripId, userId, done);
  if (!updated) return res.status(404).json({ message: "Trip not found" });
  res.json(updated.todoList);
};

export const batchAddTodos = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { id: tripId } = req.params;
  const { items } = req.body;
  const updated = await tripService.batchAddTodos(tripId, userId, items);
  if (!updated) return res.status(404).json({ message: "Trip not found" });
  res.json(updated.todoList);
};
