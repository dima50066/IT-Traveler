import redisClient from "../utils/redis";
import { ChatMessage } from "../db/models/ChatMessage";

const CHAT_KEY = "chat:global";
const MAX_MESSAGES = 50;

export const saveMessage = async (msg: ChatMessage) => {
  await redisClient.lPush(CHAT_KEY, JSON.stringify(msg));
  await redisClient.lTrim(CHAT_KEY, 0, MAX_MESSAGES - 1);
};

export const getMessages = async (): Promise<ChatMessage[]> => {
  const raw = await redisClient.lRange(CHAT_KEY, 0, MAX_MESSAGES - 1);
  return raw.map((msg) => JSON.parse(msg));
};
