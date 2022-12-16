import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { userList } from '../crud/user.js'
import { emailValidation, loginValidation, changePasswordValidation, registrationValidation } from '../models/user.js';
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

// TODO: test that a JWT with null x-token can't modify a user with a null token in the DB
//       if they cannot, then figure out how to save a null token to db but also that a token must
//       be unique

router.get('/', auth(), handleGetUser)

router.post(
    '/register',
    [sanitizeRequest({ body: true }), validate(registrationValidation, {}, {})],
    handleRegistration
)

// router.post(
//     '/login',
//     [sanitizeRequest({ body: true })],
//     (req, res) => {
//         console.log(req.body)
//         res.status(400).send()
//     }
//         )
router.post(
    '/login',
    [sanitizeRequest({ body: true }), validate(loginValidation, {}, {})],
    handleLogin
)

router.post('/logout', auth(), async (req, res) => {
    const { user } = req
    console.log(`Logging out user: ${JSON.stringify(user)}`)
    // await deleteUserToken(user)
    res.send()
})

router.post(
    '/change-password',
    [sanitizeRequest({ body: true }), auth(), validate(changePasswordValidation, {}, {})],
    handleChangePassword
)

router.post(
    '/change-email',
    [sanitizeRequest({ body: true }), auth(), validate(emailValidation, {}, {})],
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

