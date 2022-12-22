import path from 'path'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { ValidationError } from 'express-validation'
import jwt from 'jsonwebtoken'
import logger from 'morgan'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'

import config from './common/config.js'
import { getUserByToken } from './crud/user.js'
import abilityKeywordRouter from './routes/abilityKeyword.js'
import csgModelRouter from './routes/csgModel.js'
import healthCheckRouter from './routes/healthCheck.js'
import piratesCollectionRouter from './routes/piratesCollection.js'
import userRouter from './routes/user.js'
import startServer, { connectDb } from './utils/startup.js'

const ROUTE_PREFIX = '/v1'

let app = express()

app.use(logger('dev'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.6:3000', // local network access
    'https://piratescsg.net',
    'https://www.piratescsg.net'
]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

startServer(app)
connectDb()

passport.use(new BearerStrategy(async (token, done) => {
    let verifiedToken = null
    try {
        verifiedToken = jwt.verify(token, config.JWT_SECRET)
    } catch(err) {
        console.log('Unable to decode token with JWT secret')
        console.dir(err)
        return done(null, false)
    }

    if (!(verifiedToken.iss === config.BASE_URL && verifiedToken.aud === config.BASE_URL)) {
        return done(null, false)
    }

    return await getUserByToken(verifiedToken.token)
        .then((user) => {
            if (!user) { return done(null, false) }
            return done(null, user, { scope: 'all' })
        })
        .catch(err => {
            console.log(err)
            return done(null, false)
        })
}))

const routers = [
    {
        route: '/pirates-csg',
        router: csgModelRouter,
    },
    {
        route: '/collection',
        router: piratesCollectionRouter,
    },
    {
        route: '/ability-keyword',
        router: abilityKeywordRouter,
    },
    {
        route: '/health',
        router: healthCheckRouter,
    },
    {
        route: '/user',
        router: userRouter
    }
]

routers.forEach(router => {
    app.use(ROUTE_PREFIX + router.route, router.router)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Not found')
})

// handle express validation errors
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }

    return res.status(500).json(err)
})

export default app

