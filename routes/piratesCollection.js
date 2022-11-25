import express from 'express'

import { updateCollection, removeFromCollection, getCollectionList } from '../crud/piratesCollection.js'

const router = express.Router();

// TODO: get user collection is being updated for
router.put('/update', async (req, res) => {
    console.log(req.body)
    res.send(await updateCollection(req.body.collection, req.body.user))
})

router.put('/remove', async (req, res) => {
})

router.get('', async (req, res) => {
    res.send(await getCollectionList('BingoKnight'))
})

export default router

