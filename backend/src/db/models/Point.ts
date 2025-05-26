import { optional } from "joi";
import { Schema, model } from "mongoose";

const pointSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    tripId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      required: true,
    },
    dayNumber: {
      type: Number,
      min: 1,
    },
    orderIndex: {
      type: Number,
    },
    transportMode: {
      type: String,
      enum: [
        "car",
        "walk",
        "public",
        "plane",
        "train",
        "bike",
        "boat",
        "taxi",
        "bus",
      ],
    },
    category: {
      type: String,
      enum: [
        "food",
        "history",
        "nature",
        "accommodation",
        "airport",
        "restaurant",
        "museum",
        "shopping",
        "museum",
        "station",
        "other",
      ],
    },
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    img: {
      type: String,
    },
    costFromPrevious: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Point = model("Point", pointSchema);
