import express from 'express'

import { updateCollection, removeFromCollection, getCollectionList } from '../crud/piratesCollection.js'

const protectedRouter = express.Router();
const unprotectedRouter = express.Router();


// TODO: get user collection is being updated for
unprotectedRouter.put('/update', async (req, res) => {
    console.log(req.body)
    res.send(await updateCollection(req.body.collection, req.body.user))
})

unprotectedRouter.put('/remove', async (req, res) => {
})

unprotectedRouter.get('', async (req, res) => {
    res.send(await getCollectionList('BingoKnight'))
})

export default {
    protectedRouter,
    unprotectedRouter
}

