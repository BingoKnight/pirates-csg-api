import express from 'express'
import _ from 'lodash'

import { addKeyword, getKeywords } from '../crud/abilityKeyword.js';

const protectedRouter = express.Router();
const unprotectedRouter = express.Router();

protectedRouter.put('/update', async (req, res, next) => {
    console.log(req.body)
    res.send(await addKeyword(req.body))
})

protectedRouter.get('', async (req, res, next) => {
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

export default {
    protectedRouter,
    unprotectedRouter
}

