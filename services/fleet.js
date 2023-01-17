import config from "../common/config.js"
import {findCsgModelsByObjectIds} from "../crud/csgModel.js"
import {
    createFleet,
    deleteFleet,
    getFleetById,
    getFleetList,
    getFleetTotalCount,
    updateFleet
} from "../crud/fleet.js"

// TODO: Add validation around crew factions on ships, crew with ability of any nationality should
//       be considered
// TODO: Add validation around crew point cost not exceeding ships point cost

function getValidationError(err) {
    console.log(err)

    if (err.path === '_id') {
        return [400, 'Invalid fleet ID']
    }

    let castError
    try {
        castError = Object.values(err.errors).find(errValueObj => errValueObj.name === 'CastError')
    } catch (err) {
        console.error(JSON.stringify(err))
        return [500, 'Unexpected error occurred']
    }

    if (err.name === 'ValidationError' && castError) {
        console.log(`Unable to create fleet because ID ${castError.reason.value} doesn't exist`)
        return [400, `Invalid model ID: ${castError.reason.value}`]
    }

    if (err.name === 'ValidationError' && Object.keys(err.errors).includes('pointCost')) {
        console.log(`Minimum point cost threshold not met: ${JSON.stringify(err)}`)
        return [400, 'Fleet must cost more than 0 points']
    }

    console.error(JSON.stringify(err))
    return [500, 'Unexpected error occurred']
}

async function getFleetValidationErrors(populatedFleet) {
    function isValidAttachment(attachment) {
        return !['crew', 'equipment'].includes(attachment.type.toLowerCase())
    }

    let errors = []

    const invalidShips = populatedFleet.ships.filter(ship => ship.type.toLowerCase() !== 'ship')
    const invalidForts = populatedFleet.forts.filter(fort => fort.type.toLowerCase() !== 'fort')
    const invalidAttachments = populatedFleet.attachments.filter(isValidAttachment)
    const invalidEvents = populatedFleet.events.filter(event => event.type.toLowerCase() !== 'event')
    const invalidUnassigned = populatedFleet.unassigned.filter(isValidAttachment)
    const invalidUniqeTreasure = populatedFleet.uniqueTreasure.filter(ut => ut.type.toLowerCase() !== 'treasure')

    if (invalidShips.length > 0) {
        errors = errors.concat(
            invalidShips.map(model => {
                return {
                    type: 'INVALID_SHIP',
                    message: `${model._id} is not a ship`
                }
            })
        )
    }

    if (invalidForts.length > 0) {
        errors = errors.concat(
            invalidForts.map(model => {
                return {
                    type: 'INVALID_FORT',
                    message: `${model._id} is not a fort`
                }
            })
        )
    }

    if (invalidAttachments.length > 0) {
        errors = errors.concat(
            invalidAttachments.map(model => {
                return {
                    type: 'INVALID_ATTACHMENT',
                    message: `${model._id} is not a crew or equipment`
                }
            })
        )
    }

    if (invalidEvents.length > 0) {
        errors = errors.concat(
            invalidEvents.map(model => {
                return {
                    type: 'INVALID_EVENT',
                    message: `${model._id} is not an event`
                }
            })
        )
    }

    if (invalidUnassigned.length > 0) {
        errors = errors.concat(
            invalidUnassigned.map(model => {
                return {
                    type: 'INVALID_UNASSIGNED',
                    message: `${model._id} is not a crew or equipment`
                }
            })
        )
    }

    if (invalidUniqeTreasure.length > 0) {
        errors = errors.concat(
            invalidUniqeTreasure.map(model => {
                return {
                    type: 'INVALID_UNIQUE_TREASURE',
                    message: `${model._id} is not a unique treasure`
                }
            })
        )
    }

    return errors
}

function calculateFleetPointCost(populatedFleet) {
    return Object
        .keys(populatedFleet)
        .flatMap(key => populatedFleet[key])
        .filter(model => ['crew', 'ship', 'event', 'equipment'].includes(model.type.toLowerCase()))
        .reduce((acc, model) => acc + model.pointCost, 0)
}

async function getPopulatedFleet(fleet) {
    const attachmentIds = fleet.ships.flatMap(ship => ship.attachments).filter(id => id)
    const dbPopulatedFleet = {
        ships: await findCsgModelsByObjectIds(fleet.ships.map(ship => ship.ship)),
        forts: await findCsgModelsByObjectIds(fleet.forts),
        attachments: await findCsgModelsByObjectIds(attachmentIds),
        events: await findCsgModelsByObjectIds(fleet.events),
        unassigned: await findCsgModelsByObjectIds(fleet.unassigned),
        uniqueTreasure: await findCsgModelsByObjectIds(fleet.uniqueTreasure)
    }

    const modifiedFleet = {
        ...fleet,
        ships: fleet.ships.map(ship => ship.ship),
        attachments: attachmentIds
    }

    function getDuplicateIds(fleetAttributeList) {
        let unique = []
        return fleetAttributeList
            .map(id => {
                if (unique.includes(id)) {
                    return id
                }
                unique.push(id)
                return null
            })
            .filter(id => id)
    }

    return Object.fromEntries(
        Object.keys(dbPopulatedFleet).map(key => {
            if (modifiedFleet[key] && modifiedFleet[key].length !== dbPopulatedFleet[key].length) {
                const duplicates = getDuplicateIds(modifiedFleet[key])

                const duplicateModels = duplicates.map(id => {
                    return dbPopulatedFleet[key].find(model => model._id.toString() === id)
                })

                return [key, [...dbPopulatedFleet[key], ...duplicateModels]]
            }

            return [key, dbPopulatedFleet[key]]
        })
    )
}

export async function fleetGetHandler(req, res) {
    const pageNumber = req.query.page || 1
    const pageLimit = req.query.limit || 50

    console.log(`Getting fleet list page number ${pageNumber}, limit ${pageLimit}`)

    const fleetList = await getFleetList(pageNumber, pageLimit)

    const nextUrl = fleetList.length > pageLimit
        ? `${config.BASE_URL}/v1/fleet?page=${pageNumber + 1}&limit=${pageLimit}`
        : null

    const previousUrl = pageNumber > 1
        ? `${config.BASE_URL}/v1/fleet?page=${pageNumber - 1}&limit=${pageLimit}`
        : null

    res.send({
        page: {
            next: nextUrl,
            previous: previousUrl,
            limit: pageLimit,
            total: await getFleetTotalCount()
        },
        results: fleetList
    })
}

export async function fleetGetOneHandler(req, res) {
    const { fleetId } = req.params

    console.log(`Getting Fleet for ID ${fleetId}`)

    let fleetObj

    try {
        fleetObj = await getFleetById(fleetId)
        console.log(fleetObj)
    } catch (err) {
        console.log(`Invalid fleet ID ${fleetId}`)
        console.log(err)
        res.status(400).send({
            error: `${fleetId} is not a valid ID`
        })
        return
    }

    if (!fleetObj) {
        res.status(404).send({
            error: `Fleet ID ${fleetId} does not exist`
        })
        return
    }

    res.send(fleetObj)
}

export async function fleetCreateHandler(req, res) {
    console.log(req.body)

    const { user } = req
    const baseFleet = req.body

    console.log(`Creating new fleet for user ${user.username} with ${JSON.stringify(baseFleet)}`)

    let populatedFleet
    try {
        populatedFleet = await getPopulatedFleet(baseFleet)
    } catch (err) {
        const [ statusCode, message ] = getValidationError(err)
        res.status(statusCode).send({ error: message })
        return
    }

    const fleetValidationErrors = await getFleetValidationErrors(populatedFleet)

    if (fleetValidationErrors.length > 0) {
        console.log(`Fleet failed validation with the following errors: ${fleetValidationErrors}`)
        res.status(400).send({
            errors: fleetValidationErrors
        })
        return
    }

    const pointCost = calculateFleetPointCost(populatedFleet)

    let fleetCreateResult
    try {
        fleetCreateResult = await createFleet({ ...baseFleet, pointCost, user })
    } catch (err) {
        const [statusCode, errorMessage] = getValidationError(err)

        res.status(statusCode).send({
            error: errorMessage
        })
        return
    }

    console.log(`Fleet create results: ${fleetCreateResult}`)

    const newFleet = await getFleetById(fleetCreateResult._id)

    res.send(newFleet)
}

export async function fleetUpdateHandler(req, res) {
    console.log(req.body)

    const { user } = req
    const fleetToUpdate = req.body

    console.log(`Updating fleet for user ${user.username} with ${JSON.stringify(fleetToUpdate)}`)

    let populatedFleet
    try {
        populatedFleet = await getPopulatedFleet(fleetToUpdate)
    } catch (err) {
        const [ statusCode, message ] = getValidationError(err)
        res.status(statusCode).send({ error: message })
        return
    }

    const fleetValidationErrors = await getFleetValidationErrors(populatedFleet)

    if (fleetValidationErrors.length > 0) {
        console.log(`Fleet failed validation with the following errors: ${fleetValidationErrors}`)
        res.status(400).send({
            errors: fleetValidationErrors
        })
        return
    }

    const pointCost = calculateFleetPointCost(populatedFleet)

    let updatedFleet
    try {
        updatedFleet = await updateFleet({ ...fleetToUpdate, user, pointCost })
    } catch (err) {
        const [statusCode, errorMessage] = getValidationError(err)

        res.status(statusCode).send({
            error: errorMessage
        })
        return
    }

    if (updatedFleet) {
        console.log(`Fleet ${fleetToUpdate._id} successfully updated`)
        res.send(updatedFleet)
    } else {
        console.log('Fleet either did not exist or user did not have permission to update')
        res.status(404).send({
            error: `Fleet ID ${fleetToUpdate._id} does not exist`
        })
    }
}

export async function fleetDeleteHandler(req, res) {
    console.log(req.params)

    const { user } = req
    const { fleetId } = req.params

    console.log(`Deleting fleet ${fleetId} for user ${user.username}`)

    const fleetToDelete = await getFleetById(fleetId)

    if (!fleetToDelete) {
        res.status(404).send({
            error: `Fleet ID ${fleetId} does not exist`
        })
        return
    }

    console.log(`Found fleet ${fleetId}: ${fleetToDelete}`)

    const deletedFleet = await deleteFleet(fleetToDelete, user)

    if (deletedFleet) {
        console.log(`Successfully deleted fleet ${fleetId}`)
        res.send(deletedFleet)
    } else {
        console.log(`User ${user.username} does not have permission to update fleet ${fleetId}`)
        res.status(401).send('Unauthorized')
    }
}

