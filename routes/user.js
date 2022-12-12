import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { deleteUserToken, userList } from '../crud/user.js'
import { emailValidation, loginValidation, passwordValidation, registrationValidation } from '../models/user.js';
import {
    handleChangeEmail,
    handleChangePassword,
    handleForgotUsername,
    handleGetUser,
    handleLogin,
    handleRegistration
} from '../services/user.js';
import { auth } from '../utils/auth.js'

const router = express.Router();

router.get('/', auth(), handleGetUser)

router.post(
    '/register',
    [sanitizeRequest({ body: true }), validate(registrationValidation, {}, {})],
    handleRegistration
)

router.post(
    '/login',
    [sanitizeRequest({ body: true }), validate(loginValidation, {}, {})],
    handleLogin
)

router.post('/logout', auth(), async (req, res) => {
    const { user } = req
    console.log(`Logging out user: ${JSON.stringify(user)}`)
    await deleteUserToken(user)
    res.send()
})

router.post(
    '/change-password',
    [sanitizeRequest({ body: true }), validate(passwordValidation, {}, {}), auth()],
    handleChangePassword
)

router.post(
    '/change-password',
    [sanitizeRequest({ body: true }), validate(passwordValidation, {}, {}), auth()],
    handleChangePassword
)

router.post(
    '/change-email',
    [sanitizeRequest({ body: true }), validate(emailValidation, {}, {}), auth()],
    handleChangeEmail
)

// router.post(
//     '/forgot-username',
//     [sanitizeRequest({ body: true }), validate(emailValidation, {}, {})],
//     handleForgotUsername
// )

router.get('', auth(), async (req, res) => {
    res.send(await userList())
})

export default router

