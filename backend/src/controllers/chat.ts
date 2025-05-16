import { Request, Response } from "express";
import { saveMessage, getMessages } from "../services/chat";
import { v4 as uuidv4 } from "uuid";

export const sendMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const { message } = req.body;
  const user = req.user!;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ message: "Message is required" });
  }

  const name = user.name || user.email || "Анонім";

  const chatMessage = {
    messageId: uuidv4(),
    senderId: userId,
    senderName: name,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  await saveMessage(chatMessage);
  res.json({ status: "ok", message: chatMessage });
};

export const getChatHistory = async (_req: Request, res: Response) => {
  const messages = await getMessages();
  res.json(messages);
};
