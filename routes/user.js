import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { userList } from '../crud/user.js'
import { emailValidation, loginValidation, changePasswordValidation, registrationValidation } from '../models/user.js';
import {
    changeEmailHandler,
    changePasswordHandler,
    forgotUsernameHandler,
    getUserHandler,
    loginHandler,
    registrationHandler
} from '../services/user.js';
import { auth } from '../utils/auth.js'

const router = express.Router();

// TODO: test that a JWT with null x-token can't modify a user with a null token in the DB
//       if they cannot, then figure out how to save a null token to db but also that a token must
//       be unique

router.get('/', auth(), getUserHandler)

router.post(
    '/register',
    [sanitizeRequest({ body: true }), validate(registrationValidation, {}, {})],
    registrationHandler
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
    loginHandler
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
    changePasswordHandler
)

router.post(
    '/change-email',
    [sanitizeRequest({ body: true }), auth(), validate(emailValidation, {}, {})],
    changeEmailHandler
)

// router.post(
//     '/forgot-username',
//     [sanitizeRequest({ body: true }), validate(emailValidation, {}, {})],
//     forgotUsernameHandler
// )

router.get('', auth(), async (req, res) => {
    res.send(await userList())
})

export default router

