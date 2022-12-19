import { Joi } from 'express-validation'

export const collectionValidation = {
    body: Joi.object({
        collection: Joi.array().items(Joi.object({
            itemId: Joi
                .string()
                .required()
                .messages({
                    'string.empty': 'Item ID cannot be empty',
                }),
            count: Joi
                .number()
                .integer()
                .min(1)
                .messages({
                    'number.base': 'Count must be a number',
                    'number.integer': 'Count must be an integer',
                    'number.min': 'Count must be greater than or equal to 1'
                })
        }))
    })
}

