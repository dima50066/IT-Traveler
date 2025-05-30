import { Schema } from "mongoose";

const todoItemSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    order: { type: Number, required: true },
  },
  { _id: false }
);

export const ToDo = todoItemSchema;
