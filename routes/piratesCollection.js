import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { collectionValidation } from '../models/piratesCollection.js'
import { collectionGetHandler, collectionRemoveHandler, collectionUpdateHandler } from '../services/piratesCollection.js';
import { auth } from '../utils/auth.js'

const router = express.Router();


router.put(
    '/update',
    [sanitizeRequest({ body: true }), auth(), validate(collectionValidation, {}, {})],
    collectionUpdateHandler
)

router.delete(
    '/remove',
    [sanitizeRequest({ query: true }), auth()],
    collectionRemoveHandler
)

router.get('', auth(), collectionGetHandler)

export default router

