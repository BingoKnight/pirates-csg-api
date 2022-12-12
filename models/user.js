import { Joi } from 'express-validation'

const passwordJoi = Joi.string()
    .regex(/^[a-zA-Z0-9-_!@#$%^&*()]{6,20}$/)
    .required()
    .messages({
        'string.empty': 'Password cannot be empty',
        'string.pattern.base': 'Password can only contain alphanumeric character or the following special characters -_!@#$%^&*()'
    })

const emailJoi = Joi.string()
    .email()
    .required()
    .messages({
        'string.empty': 'Email cannot be empty',
        'string.email': 'Invalid email'
    })

export const registrationValidation = {
    body: Joi.object({
        username: Joi.string()
            .regex(/^[a-zA-Z0-9-_]{4,20}$/)
            .required()
            .messages({
                'string.empty': 'Username cannot be empty',
                'string.pattern.base': 'Username can only contain alphanumeric characters as well as hyphens (-) and underscores (_)'
            }),
        email: emailJoi,
        password: passwordJoi
    })
}

export const loginValidation = {
    body: Joi.object({
        username: Joi.string().required().messages({'string.empty': 'User does not exist with credentials provided'}),
        password: Joi.string().required().messages({'string.empty': 'User does not exist with credentials provided'})
    })
}

export const emailValidation = {
    body: Joi.object({
        email: emailJoi
    })
}

export const passwordValidation = {
    body: Joi.object({
        password: passwordJoi
    })
}
