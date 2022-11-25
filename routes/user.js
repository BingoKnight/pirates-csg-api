import express from 'express'

import { registerUser, userList } from '../crud/user.js'

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body)
    res.send(await registerUser(req.body))
})

router.get('', async (req, res) => {
    res.send(await userList())
})

export default router
