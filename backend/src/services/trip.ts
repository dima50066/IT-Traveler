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
