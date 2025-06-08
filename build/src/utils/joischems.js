import Joi from "joi";
export const bookSchemaDto = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    quantity: Joi.number().positive().max(100),
});
export const bookidSchema = Joi.string().length(36).required();
export const bookSchemareader = Joi.string().required();
export const readerDTOschema = Joi.object({
    lastname: Joi.string().required(),
    passport: Joi.string().length(10).required(),
    email: Joi.string().required(),
    birthdate: Joi.string().required(),
    password: Joi.string().required(),
});
