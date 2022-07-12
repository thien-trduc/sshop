import * as Joi from 'joi';

export const objectValid = {
    BASE_URL: Joi.string(),
    PORT: Joi.number(),
    REPO_NAME: Joi.string(),
    SWAGGER_NAME: Joi.string(),
    SWAGGER_PASSWORD: Joi.string(),
    API_DOCS_JSON: Joi.string(),
    DIRECTORY_PATH: Joi.string(),
};
