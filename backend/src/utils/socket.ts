import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { v4 as uuidv4 } from "uuid";
import { saveMessage } from "../services/chat";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("chat:message", async (payload) => {
      console.log("📨 Incoming raw payload:", payload);

      const { message, senderId, senderName } = payload;

      if (!message || typeof message !== "string" || !senderId || !senderName) {
        console.warn("⚠️ Incomplete message payload");
        return;
      }

      const chatMessage = {
        messageId: uuidv4(),
        senderId,
        senderName,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      await saveMessage(chatMessage);

      io.emit("chat:message", chatMessage);
      console.log("📤 Emitted message:", chatMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  console.log("✅ WebSocket server initialized");
};

export const getIO = (): Server => io;
