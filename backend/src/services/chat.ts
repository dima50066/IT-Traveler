import redisClient from "../utils/redis";
import { ChatMessage } from "../db/models/ChatMessage";
import { IChatMessage } from "../types/chat";

const MAX_MESSAGES = 50;

export const saveMessage = async (msg: IChatMessage) => {
  const chatKey = `chat:trip:${msg.tripId}`;
  await redisClient.lPush(chatKey, JSON.stringify(msg));
  await redisClient.lTrim(chatKey, 0, MAX_MESSAGES - 1);
  await redisClient.expire(chatKey, 60 * 60);
  await ChatMessage.create(msg);
};

export const getMessages = async (tripId: string): Promise<IChatMessage[]> => {
  const chatKey = `chat:trip:${tripId}`;
  const cached = await redisClient.lRange(chatKey, 0, MAX_MESSAGES - 1);

  if (cached.length > 0) {
    return cached.map((msg) => JSON.parse(msg));
  }

  const messages = await ChatMessage.find({ tripId })
    .sort({ timestamp: 1 })
    .limit(MAX_MESSAGES);
  if (messages.length > 0) {
    await redisClient.lPush(
      chatKey,
      messages.map((msg) => JSON.stringify(msg))
    );
    await redisClient.lTrim(chatKey, 0, MAX_MESSAGES - 1);
    await redisClient.expire(chatKey, 60 * 60);
  }
  return messages;
};
