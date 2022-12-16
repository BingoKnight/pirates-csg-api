import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import config from '../common/config.js'
import {
    getFullUser,
    getUserByEmail,
    getUserByUsername,
    registerUser,
    updateUserEmail,
    updateUserPassword,
    updateUserToken
} from '../crud/user.js'
import { setCookie } from '../utils/cookies.js'

function getUniquenessError(err) {
    const unique_error_mapper = {
        username: {
            error: 'Username is already taken'
        },
        email: {
            error: 'Email address is already in use',
        }
    }

    console.log(err)
    console.log(unique_error_mapper[Object.keys(err.keyValue)])
    return unique_error_mapper[Object.keys(err.keyValue)]
}

async function hashPassword(password) {
    const saltIterations = 10
    return await bcrypt.hash(password, saltIterations)
}

export function handleGetUser(req, res) {
    const { _id, __v, ...user } = req.user._doc // strip unneeded fields
    console.log(`GET user request for ${user.username}`)
    res.send(user)
}

export async function handleRegistration(req, res) {
    try {
        const { password, email, ...userInfo } = req.body
        console.log(`Registration request: ${JSON.stringify(userInfo)}`)

        const hashPasswordUser = {
            ...userInfo,
            email: email.toLowerCase(),
            password: await hashPassword(password),
            secret: crypto.randomBytes(256).toString('base64')
        }

        const user = await registerUser(hashPasswordUser)
        
        const logSafeUser = {
            username: user.username,
            email: user.email
        }
        console.log(`Registration result: ${JSON.stringify(logSafeUser)}`)

        setCookie(res, 'x-token', await refreshToken(user))
        res.status(201).send({
            username: user.username,
            email: user.email
        })

        return
    } catch(err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            console.log(`MongoServerError: ${err}`)
            res.status(409).send(getUniquenessError(err))
            return
        }

        console.log(`Unexpected Error: ${err}`)
        res.send(500).body('Unexpected error')
        return
    }
}

async function refreshToken(user) {
    return jwt.sign(
        {
            token: await updateUserToken(user)
        },
        config.JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '2 days',
            issuer: config.BASE_URL,
            audience: config.BASE_URL
        }
    )
}

export async function handleLogin(req, res) {
    const { username, password } = req.body

    try {
        console.log(`User login for ${username}`)

        const user = await getUserByUsername(username)
        if (!user)
            throw new Error(`No user matching username ${username}`)

        if (await bcrypt.compare(password, user.password)) {
            setCookie(res, 'x-token', await refreshToken(user))
            res.status(200).send({
                username: user.username,
                email: user.email
            })
            return
        } else {
            throw new Error('Invalid password')
        }
    } catch(err) {
        console.log(`Login error: ${err}`)
        console.dir(err)
        res.status(404).send({
            error: 'User does not exist with credentials provided'
        })
        return
    }
}

export async function handleChangePassword(req, res) {
    const { password, newPassword } = req.body
    const user = req.user

    console.log(`User change password request received for ${user.username}`)

    try {
        const dbUser = await getFullUser(user)

        if (await bcrypt.compare(password, dbUser.password)) {
            const hashedPassword = await hashPassword(newPassword)
            await updateUserPassword(user, hashedPassword)

            setCookie(res, 'x-token', await refreshToken(user))
            res.status(200).send()
            return
        } else {
            setCookie(res, 'x-token', await refreshToken(user))
            res.status(401).send({ error: 'Invalid password' })
        }
    } catch(err) {
        console.log(`Error updating password for ${user.username}: ${err}`)
        console.dir(err)
        res.status(500).send()
        return
    }
}

export async function handleChangeEmail(req, res) {
    const { email } = req.body
    const user = req.user

    console.log(`User change email request received for ${user.username}`)

    try {
        await updateUserEmail(user, email)
        setCookie(res, 'x-token', await refreshToken(user))
        res.status(200).send()
        return
    } catch(err) {
        console.log(`Error updating email for ${user.username}: ${err}`)
        console.dir(err)

        if (err.name === 'MongoServerError' && err.code === 11000) {
            console.log(`MongoServerError: ${err}`)
            res.status(409).send(getUniquenessError(err))
            return
        }

        res.status(500).send()
        return
    }
}

// TODO: create email server for piratescsg.net
// TODO: add auth to transporter
function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        secure: true
    })

    const mailData = {
        to,
        subject,
        html: body
    }

    console.dir(mailData)

    transporter.sendMail(mailData, (error, _) => {
        if (error) {
            console.log(`Error sending email: ${error}`)
            console.dir(error)
        }
    })
}

// TODO: not working
export async function handleForgotUsername(req, res) {
    const { email } = req.body

    console.log(`Forgot username request for ${email}`)

    try {
        const user = await getUserByEmail(email)

        if (!user)
            throw new Error(`Could not find account associated with ${email}`)

        const body = `
            <h2>Forgot Username request</h2>
            <p>Username: ${user.username}</p>
        `
        sendEmail(email, 'Forgot Username - PiratesCSG.net', body)
        res.status(200).send()

    } catch(err) {
        console.log(`Forgot username error: ${err}`)
        console.dir(err)

        res.status(404).send({
            error: err.message
        })
    }
}

