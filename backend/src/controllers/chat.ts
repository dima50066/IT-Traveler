import { Request, Response } from "express";
import { saveMessage, getMessages } from "../services/chat";
import { v4 as uuidv4 } from "uuid";
import { Trip } from "../db/models/Trip";
import { getSocketInstance } from "../utils/socket";

export const sendMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { tripId } = req.params;
  const { message } = req.body;
  const user = req.user!;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ message: "Message is required" });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (!trip.collaborators.includes(userId)) {
    return res.status(403).json({ message: "Access denied to chat" });
  }
  if (!trip.chatId) {
    return res.status(500).json({ message: "Trip has no chatId" });
  }

  const name = user.name || user.email || "Anonymous";

  const chatMessage = {
    messageId: uuidv4(),
    tripId,
    senderId: userId,
    senderName: name,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  await saveMessage(chatMessage);

  const io = getSocketInstance();
  io.to(`trip:${trip.chatId}`).emit("chat:message", chatMessage);

  res.json({ status: "ok", message: chatMessage });
};

export const getChatHistory = async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const userId = req.user?.id!;

  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (!trip.collaborators.includes(userId)) {
    return res.status(403).json({ message: "Access denied to chat" });
  }

  const messages = await getMessages(tripId);
  res.json({ messages, tripTitle: trip.title });
};
