import express from 'express'
import sanitizeRequest from 'express-sanitize-middleware'
import { validate } from 'express-validation'

import { fleetCreateValidation, fleetUpdateValidation } from '../models/fleet.js'
import {
    fleetCreateHandler,
    fleetDeleteHandler,
    fleetGetHandler,
    fleetGetOneHandler,
    fleetUpdateHandler
} from '../services/fleet.js';
import { auth } from '../utils/auth.js'

const router = express.Router();

router.get('', fleetGetHandler)

router.get('/:fleetId', fleetGetOneHandler)

router.post(
    '',
    [sanitizeRequest({ body: true }), auth(), validate(fleetCreateValidation, {}, {})],
    fleetCreateHandler
)

router.put(
    '',
    [sanitizeRequest({ body: true }), auth(), validate(fleetUpdateValidation, {}, {})],
    fleetUpdateHandler
)

router.delete('/:fleetId', [auth()], fleetDeleteHandler)

export default router

