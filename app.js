import path from 'path'

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from 'morgan'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'

import abilityKeywordRouter from './routes/abilityKeyword.js'
import csgModelRouter from './routes/csgModel.js'
import healthCheckRouter from './routes/healthCheck.js'
// import piratesCollectionRouter from './routes/piratesCollection.js'
// import userRouter from './routes/user.js'
import User from './schemas/user.js'
import startServer, { connectDb } from './utils/startup.js'

var app = express()

app.use(logger('dev'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))

const corsAllowList = [
    'http://localhost:3000',
    'http://piratescsg.net',
    'https://piratescsg.net'
]

app.use(cors({
    origin: corsAllowList
}))

startServer(app)
connectDb()

passport.use(new BearerStrategy((token, done) =>
    User.findOne({ token: token }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
    })
))

const routers = [
    {
        route: '/v1/pirates-csg',
        router: csgModelRouter,
    },
    // {
    //     route: '/v1/collection',
    //     router: piratesCollectionRouter,
    // },
    {
        route: '/v1/ability-keyword',
        router: abilityKeywordRouter,
    },
    {
        route: '/v1/health',
        router: healthCheckRouter,
    }
    // {
    //     route: '/v1/user',
    //     router: userRouter,
    // }
]

routers.forEach(router => {
    app.use(router.route, passport.authenticate('bearer', { session: false }), router.router.protectedRouter)
    app.use(router.route, router.router.unprotectedRouter)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Not found')
})

export default app

