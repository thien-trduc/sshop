import * as Joi from 'joi';

export const objectValid = {
    DATABASE_URL: Joi.string(),
    BASE_URL: Joi.string(),
    PORT: Joi.number(),
    REPO_NAME: Joi.string(),
    SWAGGER_NAME: Joi.string(),
    SWAGGER_PASSWORD: Joi.string(),
    API_DOCS_JSON: Joi.string(),

    FIREBASE_PROJECT_ID: Joi.string(),
    FIREBASE_PRIVATE_KEY: Joi.string(),
    FIREBASE_CLIENT_EMAIL: Joi.string(),

    GA_PRIVATE_KEY: Joi.string(),
    GA_CLIENT_EMAIL: Joi.string(),
    GA_VIEW_ID: Joi.string(),
    GOOGLE_API_SCOPE: Joi.string(),

    JWT_SECRET_KEY: Joi.string(),
    JWT_SECRET_KEY_EXPIRED_IN: Joi.string(),
    JWT_OTP_SECRET_KEY_EXPIRED_IN: Joi.string(),
    REFRESH_SECRET_KEY: Joi.string(),
    REFRESH_SECRET_EXPIRED: Joi.string(),

    SALT_HASH: Joi.number(),

    SENDGRID_TEMPLATE: Joi.string(),

    RABBIT_HOST: Joi.string(),
    RABBIT_PORT: Joi.number(),
    RABBIT_USER: Joi.string(),
    RABBIT_PASSWORD: Joi.string(),

    NAME_STORAGE_SECRET: Joi.string(),
    API_STORAGE_KEY: Joi.string(),
    SECRET_STORAGE_KEY: Joi.string(),
    MY_BUCKET: Joi.string(),
    SERVICE_STORAGE: Joi.string(),

    PAYMENT_URL: Joi.string(),

    STRIPE_SECRET: Joi.string(),
    STRIPE_EXPIRE: Joi.string(),

    STORAGE_URL: Joi.string(),
};
