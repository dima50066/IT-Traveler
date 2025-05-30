import { v4 as uuidv4 } from "uuid";
import { Trip } from "../db/models/Trip";
import { Point } from "../db/models/Point";
import { getSocketInstance } from "../utils/socket";
import { getUserById } from "./auth";
import redisClient from "../utils/redis";
import { ChatMessage } from "../db/models/ChatMessage";

export const createTrip = (data: any) => {
  const { userId, ...rest } = data;
  return Trip.create({
    ...rest,
    userId,
    collaborators: [userId],
    chatId: uuidv4(),
  });
};

export const getTripsByUser = (userId: string) =>
  Trip.find({
    $or: [{ userId }, { collaborators: userId }],
  }).sort({ startDate: 1 });

export const getTripById = (id: string) => Trip.findById(id);

export const updateTripById = (userId: string, id: string, data: any) =>
  Trip.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteTripById = async (userId: string, id: string) => {
  const trip = await Trip.findOne({ _id: id, userId });
  if (!trip) return null;

  await Point.deleteMany({ tripId: trip._id });

  await ChatMessage.deleteMany({ tripId: trip._id });

  const chatKey = `chat:trip:${trip._id}`;
  await redisClient.del(chatKey);

  await Trip.findByIdAndDelete(id);

  return trip;
};

export const inviteCollaborator = async (tripId: string, userId: string) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  const trip = await Trip.findByIdAndUpdate(
    tripId,
    { $addToSet: { collaborators: userId } },
    { new: true }
  );
  if (trip) {
    const io = getSocketInstance();
    io.to(`trip:${trip.chatId}`).emit("chat:join:trip", {
      userId,
      tripId: trip._id.toString(),
    });
  }
  return trip;
};

export const addTodoItem = async (
  tripId: string,
  userId: string,
  text: string
) => {
  const todo = { id: uuidv4(), text, done: false };
  return Trip.findOneAndUpdate(
    { _id: tripId, $or: [{ userId }, { collaborators: userId }] },
    { $push: { todoList: todo } },
    { new: true }
  );
};

export const toggleTodoItem = async (
  tripId: string,
  userId: string,
  todoId: string
) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { collaborators: userId }],
  });
  if (!trip) return null;

  const todo = trip.todoList.find((item) => item.id === todoId);
  if (!todo) return null;

  todo.done = !todo.done;
  await trip.save();
  return trip;
};

export const deleteTodoItem = async (
  tripId: string,
  userId: string,
  todoId: string
) => {
  return Trip.findOneAndUpdate(
    { _id: tripId, $or: [{ userId }, { collaborators: userId }] },
    { $pull: { todoList: { id: todoId } } },
    { new: true }
  );
};

export const updateTodoItem = async (
  tripId: string,
  userId: string,
  todoId: string,
  updates: { text?: string; done?: boolean; order?: number }
) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { collaborators: userId }],
  });
  if (!trip) return null;

  const todo = trip.todoList.find((t) => t.id === todoId);
  if (!todo) return null;

  if (updates.text !== undefined) todo.text = updates.text;
  if (updates.done !== undefined) todo.done = updates.done;
  if (updates.order !== undefined) todo.order = updates.order;

  trip.todoList.forEach((t, i) => {
    if (t.order === undefined || t.order === null) {
      t.order = i;
    }
  });

  await trip.save();
  return trip;
};

export const reorderTodoList = async (
  tripId: string,
  userId: string,
  todoIds: string[]
) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { collaborators: userId }],
  });
  if (!trip) return null;
  const map = new Map(trip.todoList.map((t) => [t.id, t]));
  trip.todoList.forEach((item) => {
    const newIndex = todoIds.indexOf(item.id);
    if (newIndex !== -1) {
      item.order = newIndex;
    }
  });
  trip.todoList.sort((a, b) => a.order - b.order);

  await trip.save();
  return trip;
};

export const markAllTodos = async (
  tripId: string,
  userId: string,
  done: boolean
) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { collaborators: userId }],
  });
  if (!trip) return null;
  trip.todoList.forEach((t) => (t.done = done));
  await trip.save();
  return trip;
};

export const batchAddTodos = async (
  tripId: string,
  userId: string,
  items: string[]
) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ userId }, { collaborators: userId }],
  });
  if (!trip) return null;
  const base = trip.todoList.length;
  const newTodos = items.map((text, i) => ({
    id: uuidv4(),
    text,
    done: false,
    order: base + i,
  }));
  trip.todoList.push(...newTodos);
  await trip.save();
  return trip;
};
