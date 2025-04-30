import Joi from "joi";

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  picture: Joi.string().uri(),
  role: Joi.string().valid("user", "admin"),
});
