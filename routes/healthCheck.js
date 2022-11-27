import express from 'express'

const protectedRouter = express.Router();
const unprotectedRouter = express.Router();

unprotectedRouter.get('/', (req, res, next) => {
    res.send('success')
})

export default {
    protectedRouter,
    unprotectedRouter
}

