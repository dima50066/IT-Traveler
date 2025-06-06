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
    description: {
      type: String,
      trim: true,
    },
    notes: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        authorId: { type: String },
      },
    ],

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
