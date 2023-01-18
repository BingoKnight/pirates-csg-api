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
    ships: Joi.array().items(
        Joi.object({
            ship: Joi.string(),
            attachments: Joi.array().items(Joi.string())
        })
    ),
    forts: Joi.array().items(Joi.string()),
    events: Joi.array().items(Joi.string()),
    unassigned: Joi.array().items(Joi.string()),
    uniqueTreasure: Joi.array().items(Joi.string())
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

