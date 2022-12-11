import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { deleteUserToken, userList } from '../crud/user.js'
import { emailValidation, loginValidation, registrationValidation } from '../models/user.js';
import { handleForgotUsername, handleLogin, handleRegistration } from '../services/user.js';
import { auth } from '../utils/auth.js'

const router = express.Router();

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

// router.post(
//     '/forgot-username',
//     [sanitizeRequest({ body: true }), validate(emailValidation, {}, {})],
//     handleForgotUsername
// )

router.get('', auth(), async (req, res) => {
    res.send(await userList())
})

export default router

