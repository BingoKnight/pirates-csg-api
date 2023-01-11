import express from 'express'

import { importCsgModels, queryCsgModels } from '../crud/csgModel.js';
import { auth } from '../utils/auth.js'
import { capitalize } from '../utils/string.js'

const router = express.Router();

// router.put('/import', auth(), async (req, res, next) => {
//     console.log(req.body)
//     res.send(await importCsgModels(req.body))
// })

router.get('', async (req, res, next) => {
    const piratesCsgArray = await queryCsgModels(req.query)
    const resJson = {
        count: piratesCsgArray.length,
        models: piratesCsgArray
    }
    res.send(resJson)
})

// router.put('/keywords', auth(), async (req, res) => {
//     const piratesCsgArray = await queryCsgModels(req.query)
//     const updatedPiratesCsgArray = piratesCsgArray.map(csgItem => {
//         const newKeywords = req.body.keywords
//             .map(t => capitalize(t))
//             .filter(keyword => !csgItem.keywords.includes(keyword))
//         csgItem.keywords.push(...newKeywords)
//         return csgItem
//     })
//     const failures = await importCsgModels(updatedPiratesCsgArray)
//
//     res.send({
//         count: updatedPiratesCsgArray.length,
//         failures,
//         updatedModels: updatedPiratesCsgArray
//     })
// })
//
// router.delete('/keywords', auth(), async (req, res) => {
//     const {id, set, keyword} = req.query
//     const piratesCsgArray = await queryCsgModels({id, set})
//     const updatedPiratesCsgArray = piratesCsgArray.map(csgItem => {
//         const updatedKeywords = csgItem.keywords.filter(k => k !== keyword)
//         csgItem.keywords = [...new Set(updatedKeywords)]
//         return csgItem
//     })
//     const failures = await importCsgModels(updatedPiratesCsgArray)
//
//     res.send({
//         count: updatedPiratesCsgArray.length,
//         failures,
//         updatedModels: updatedPiratesCsgArray
//     })
// })

export default router

