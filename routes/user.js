import express from 'express'

import { registerUser, userList } from '../crud/user.js'

const protectedRouter = express.Router();
const unprotectedRouter = express.Router()

unprotectedRouter.post('/register', async (req, res) => {
    console.log(req.body)
    res.send(await registerUser(req.body))
})

protectedRouter.get('', async (req, res) => {
    res.send(await userList())
})

export default {
    protectedRouter,
    unprotectedRouter
}

