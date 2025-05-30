import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Trip } from "../db/models/Trip";
import { saveMessage } from "../services/chat";
import { env } from "./env";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    const tripId = socket.handshake.query.tripId as string;

    if (!token || !tripId) {
      return next(new Error("Authentication or tripId required"));
    }

    try {
      const decoded = jwt.verify(token, env("JWT_SECRET")) as { id: string };
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return next(new Error("Trip not found"));
      }
      if (!trip.collaborators.includes(decoded.id)) {
        return next(new Error("Access denied"));
      }
      socket.data.userId = decoded.id;
      socket.data.tripId = tripId;
      socket.join(`trip:${trip.chatId}`);
      next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("chat:join:trip", async ({ tripId, userId }) => {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        socket.emit("chat:error", { message: "Trip not found" });
        return;
      }
      if (!trip.collaborators.includes(userId)) {
        socket.emit("chat:error", { message: "Access denied" });
        return;
      }
      socket.join(`trip:${trip.chatId}`);
      socket.emit("chat:joined", { tripId, chatId: trip.chatId });
    });

    socket.on("chat:message", async (payload) => {
      const { tripId, message, senderId, senderName, messageId } = payload;

      if (
        !message ||
        typeof message !== "string" ||
        !senderId ||
        !senderName ||
        !tripId
      ) {
        socket.emit("chat:error", { message: "Invalid message payload" });
        return;
      }

      const trip = await Trip.findById(tripId);
      if (!trip) {
        socket.emit("chat:error", { message: "Trip not found" });
        return;
      }
      if (!trip.collaborators.includes(senderId)) {
        socket.emit("chat:error", { message: "Access denied" });
        return;
      }

      const chatMessage = {
        messageId: messageId || uuidv4(),
        tripId,
        senderId,
        senderName,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      await saveMessage(chatMessage);
      io.to(`trip:${trip.chatId}`).emit("chat:message", chatMessage);

      trip.collaborators.forEach((collaboratorId) => {
        if (collaboratorId !== senderId) {
          io.to(collaboratorId).emit("notification", {
            message: `New message in trip: ${trip.title}`,
            tripId,
          });
        }
      });
    });

    socket.on("disconnect", () => {});
  });
};

export const getSocketInstance = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const sendNotification = (userId: string, notification: any) => {
  if (!io) {
    return;
  }
  io.to(userId).emit("notification", notification);
};
