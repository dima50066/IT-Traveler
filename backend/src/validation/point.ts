import Joi from "joi";

export const createPointSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null).required(),
  img: Joi.string().uri().optional,
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});

export const updatePointSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  img: Joi.string().uri(),
  coordinates: Joi.array().items(Joi.number()).length(2),
});
