import Joi from "joi";

export const createPointSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export const updatePointSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  lat: Joi.number(),
  lng: Joi.number(),
});
