import path from 'path'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import logger from 'morgan'

import csgModelRouter from './routes/csgModel.js'
import userRouter from './routes/user.js'
import piratesCollectionRouter from './routes/piratesCollection.js'
import abilityKeywordRouter from './routes/abilityKeyword.js'
import startServer, { connectDb } from './utils/startup.js'

var app = express()

app.use(logger('dev'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))

const corsAllowList = [
    'http://localhost:3000'
]

app.use(cors({
    origin: corsAllowList
}))

startServer(app)
connectDb()

app.use('/pirates-csg', csgModelRouter)
app.use('/user', userRouter)
app.use('/collection', piratesCollectionRouter)
app.use('/ability-keyword', abilityKeywordRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Not found')
})

export default app

