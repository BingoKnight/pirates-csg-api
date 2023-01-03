import jwt from 'jsonwebtoken'
import passport from 'passport'

import config from '../common/config.js'
import { updateUserToken } from '../crud/user.js'

export function auth() {
    return passport.authenticate('bearer', { session: false })
}

export async function refreshToken(user) {
    return jwt.sign(
        {
            token: await updateUserToken(user)
        },
        config.JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: 60 * 60 * 24 * 7,
            issuer: config.BASE_URL,
            audience: config.BASE_URL
        }
    )
}

