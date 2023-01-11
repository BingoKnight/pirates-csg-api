import express from 'express'
import _ from 'lodash'

import { addKeyword, getKeywords } from '../crud/abilityKeyword.js';
import { adminAuth } from '../utils/auth.js'

const router = express.Router();

router.put('/update', adminAuth(), async (req, res, next) => {
    console.log(req.body)
    res.send(await addKeyword(req.body))
})

router.get('', adminAuth(), async (req, res, next) => {
    let query = {}

    if (req.query.name) {
        query = {
            name: {
                $regex: _.escapeRegExp(req.query.name),
                $options: 'i'
            }
        }
    }

    res.send({keywords: await getKeywords(query)})
})

export default router

