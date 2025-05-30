import Joi from "joi";

const todoItemSchema = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().trim().required(),
  done: Joi.boolean().required(),
  order: Joi.number().required(),
});

export const updateTodoSchema = Joi.object({
  text: Joi.string().trim(),
  done: Joi.boolean(),
  order: Joi.number(),
}).or("text", "done", "order");

export const reorderSchema = Joi.object({
  todoIds: Joi.array().items(Joi.string().required()).required(),
});

export const markAllSchema = Joi.object({
  done: Joi.boolean().required(),
});

export const batchAddSchema = Joi.object({
  items: Joi.array().items(Joi.string().trim().required()).min(1).required(),
});

export const createTripSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow("", null),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  status: Joi.string().valid("planned", "in_progress", "completed").optional(),
  budget: Joi.object({
    transport: Joi.number().min(0).optional(),
    accommodation: Joi.number().min(0).optional(),
    food: Joi.number().min(0).optional(),
    other: Joi.number().min(0).optional(),
  }).optional(),
  todoList: Joi.array().items(todoItemSchema).optional(),
  collaborators: Joi.array().items(Joi.string()).optional(),
}).custom((value, helpers) => {
  if (
    value.startDate &&
    value.endDate &&
    new Date(value.endDate) < new Date(value.startDate)
  ) {
    return helpers.error("any.invalid", {
      message: "endDate must be after startDate",
    });
  }
  return value;
}, "endDate after startDate validation");

export const updateTripSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim().allow("", null),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  status: Joi.string().valid("planned", "in_progress", "completed"),
  budget: Joi.object({
    transport: Joi.number().min(0),
    accommodation: Joi.number().min(0),
    food: Joi.number().min(0),
    other: Joi.number().min(0),
  }).optional(),
  todoList: Joi.array().items(todoItemSchema),
  collaborators: Joi.array().items(Joi.string()),
  userId: Joi.string(),
  chatId: Joi.string(),
  id: Joi.string(),
  _id: Joi.string(),
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
  __v: Joi.number(),
}).custom((value, helpers) => {
  if (
    value.startDate &&
    value.endDate &&
    new Date(value.endDate) < new Date(value.startDate)
  ) {
    return helpers.error("any.invalid", {
      message: "endDate must be after startDate",
    });
  }
  return value;
}, "endDate after startDate validation");

export const inviteUserSchema = Joi.object({
  userId: Joi.string().required(),
});
