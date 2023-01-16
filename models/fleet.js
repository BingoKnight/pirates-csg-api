import { Joi } from 'express-validation'

const baseFleetValidation = {
    title: Joi
        .string()
        .required()
        .max(128)
        .messages({
            'string.empty': 'Fleet title cannot be empty',
            'string.max': 'Fleet title may not exceed 128 characters'
        }),
    description: Joi
        .string()
        .min(0)
        .max(4096)
        .messages({
            'string.max': 'Description may not exceed 4096 characters'
        }),
    pointCost: Joi
        .number()
        .integer()
        .min(1)
        .messages({
            'number.base': 'Fleet point cost must be a number',
            'number.integer': 'Fleet point cost must be an integer',
            'number.min': 'Fleet point cost must be greater than or equal to 1'
        }),
    models: Joi.array().items(Joi.string())
}


export const fleetCreateValidation = {
    body: Joi.object({
        ...baseFleetValidation
    })
}

export const fleetUpdateValidation = {
    body: Joi.object({
        ...baseFleetValidation,
        _id: Joi
            .string()
            .required()
            .messages({
                'string.empty': 'Fleet ID is required'
            })
    })
}

