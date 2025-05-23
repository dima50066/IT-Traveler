import Joi from "joi";

export const createPointSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null).required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
  status: Joi.string().valid("wishlist", "visited").optional(),
  tripId: Joi.string().required(),
});

export const updatePointSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow("", null),
  coordinates: Joi.array().items(Joi.number()).length(2),
  img: Joi.string().uri().optional(),
  status: Joi.string().valid("wishlist", "visited").optional(),
  tripId: Joi.string(),
});
