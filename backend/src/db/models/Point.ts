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
    img: {
      type: String,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => arr.length === 2,
        message: "Coordinates must be a [number, number] array",
      },
    },
    status: {
      type: String,
      enum: ["wishlist", "visited"],
      default: "wishlist",
    },
  },
  { timestamps: true }
);

export const Point = model("Point", pointSchema);
