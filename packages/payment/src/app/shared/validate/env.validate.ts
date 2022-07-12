import * as Joi from 'joi';

export const envValidateObj = {
  PORT: Joi.number(),
  BASE_URL: Joi.string(),
  STRIPE_SECRET_KEY: Joi.string(),
  STRIPE_SECRET: Joi.string(),
  STRIPE_EXPIRE: Joi.string(),
  WEB_REDIRECT_URL: Joi.string(),
}
