import * as Joi from 'joi';

export const envValidateObj = {
    PORT: Joi.number(),
    BASE_URL: Joi.string(),
    STRIPE_SECRET_KEY: Joi.string(),
    BACKEND_ADMIN_API: Joi.string(),
};
