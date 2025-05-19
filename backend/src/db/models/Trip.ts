import { Schema, model, Types } from "mongoose";

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed"],
      default: "planned",
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    collaborators: {
      type: [String],
      default: [],
    },
    chatId: {
      type: String,
    },
    budget: {
      transport: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    todoList: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = model("Trip", tripSchema);
