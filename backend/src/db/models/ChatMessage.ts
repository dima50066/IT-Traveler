import { Schema, model } from "mongoose";

const chatMessageSchema = new Schema(
  {
    messageId: { type: String, required: true, unique: true },
    tripId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = model("ChatMessage", chatMessageSchema);
