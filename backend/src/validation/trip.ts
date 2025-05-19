import Joi from "joi";

export const createTripSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  status: Joi.string().valid("planned", "in_progress", "completed").optional(),
  budget: Joi.object({
    transport: Joi.number().min(0).optional(),
    accommodation: Joi.number().min(0).optional(),
    food: Joi.number().min(0).optional(),
    other: Joi.number().min(0).optional(),
  }).optional(),
  todoList: Joi.array().items(Joi.string()).optional(),
  collaborators: Joi.array().items(Joi.string()).optional(),
});

export const updateTripSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  status: Joi.string().valid("planned", "in_progress", "completed"),
  budget: Joi.object({
    transport: Joi.number().min(0),
    accommodation: Joi.number().min(0),
    food: Joi.number().min(0),
    other: Joi.number().min(0),
  }),
  todoList: Joi.array().items(Joi.string()),
  collaborators: Joi.array().items(Joi.string()),
});

export const inviteUserSchema = Joi.object({
  userId: Joi.string().required(),
});
