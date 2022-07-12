import * as Joi from 'joi';

export const objectValid = {
    BASE_URL: Joi.string(),
    PORT: Joi.number(),
    REPO_NAME: Joi.string(),
    SWAGGER_NAME: Joi.string(),
    SWAGGER_PASSWORD: Joi.string(),
    API_DOCS_JSON: Joi.string(),

    RABBIT_HOST: Joi.string(),
    RABBIT_PORT: Joi.number(),
    RABBIT_USER: Joi.string(),
    RABBIT_PASSWORD: Joi.string(),
    RABBIT_EXCHANGE: Joi.string(),
    RABBIT_TOPIC_EXCHANGE: Joi.string(),

    DATABASE_URL: Joi.string(),

    SENDGRID_API_KEY: Joi.string(),
    SENDGRID_TEMPLATE: Joi.string(),
    SENDGRID_TEMPLATE_REGISTER: Joi.string(),
    SENDGRID_TEMPLATE_RECEIPT: Joi.string(),
    SENDGRID_TEMPLATE_OTP_VERIFY: Joi.string(),
    MAIL_FROM: Joi.string(),

    REDIS_HOST: Joi.string(),
    REDIS_PORT: Joi.number(),
    REDIS_PASSWORD: Joi.string(),
    REDIS_EXPIRE: Joi.number(),

    FIREBASE_PROJECT_ID: Joi.string(),
    FIREBASE_PRIVATE_KEY: Joi.string(),
    FIREBASE_CLIENT_EMAIL: Joi.string(),
};
