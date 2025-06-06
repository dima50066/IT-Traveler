import Joi from "joi";

const coordinatesSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

const noteItemSchema = Joi.object({
  text: Joi.string().required(),
  createdAt: Joi.date().optional(),
  authorId: Joi.string().optional(),
});

const notesSchema = Joi.array().items(noteItemSchema);

export const createPointSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  notes: notesSchema.optional(),
  coordinates: coordinatesSchema.required(),
  dayNumber: Joi.number().integer().min(1).optional(),
  orderIndex: Joi.number().optional(),
  transportMode: Joi.string()
    .valid(
      "car",
      "walk",
      "public",
      "plane",
      "train",
      "bike",
      "boat",
      "taxi",
      "bus"
    )
    .optional(),
  category: Joi.string()
    .valid(
      "food",
      "history",
      "nature",
      "accommodation",
      "airport",
      "restaurant",
      "museum",
      "shopping",
      "station",
      "other"
    )
    .optional(),
  img: Joi.string().uri().optional(),
  costFromPrevious: Joi.number().min(0).optional(),
  tripId: Joi.string().required(),
});

export const updatePointSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("").optional(),
  notes: notesSchema.optional(),
  coordinates: coordinatesSchema,
  dayNumber: Joi.number().integer().min(1),
  orderIndex: Joi.number(),
  transportMode: Joi.string().valid(
    "car",
    "walk",
    "public",
    "plane",
    "train",
    "bike",
    "boat",
    "taxi",
    "bus"
  ),
  category: Joi.string().valid(
    "food",
    "history",
    "nature",
    "accommodation",
    "airport",
    "restaurant",
    "museum",
    "shopping",
    "station",
    "other"
  ),
  img: Joi.string().uri(),
  costFromPrevious: Joi.number().min(0).optional(),
  tripId: Joi.string(),
});
