import config from "../common/config.js"
import {
    createFleet,
    deleteFleet,
    getFleetById,
    getFleetList,
    getFleetTotalCount,
    updateFleet
} from "../crud/fleet.js"

function getValidationError(err) {
    if (err.path === '_id') {
        return [400, 'Invalid fleet ID']
    }

    console.log(JSON.stringify(err))

    const castError = Object.values(err.errors).find(errValueObj => errValueObj.name === 'CastError')

    if (err.name === 'ValidationError' && castError) {
        console.log(`Unable to create fleet because ID ${castError.reason.value} doesn't exist`)
        return [400, `Invalid model ID: ${castError.reason.value}`]
    } else {
        console.error(err)
        return [500, 'Unexpected error occurred']
    }
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

    let fleetObj = undefined

    console.log(fleetId)

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

    let fleetCreateResult

    try {
        fleetCreateResult = await createFleet({ ...baseFleet, user })
    } catch (err) {
        const [statusCode, errorMessage] = getValidationError(err)

        res.status(statusCode).send({
            error: errorMessage
        })
        return
    }

    console.log(fleetCreateResult)

    const newFleet = await getFleetById(fleetCreateResult._id)

    res.send(newFleet)
}

export async function fleetUpdateHandler(req, res) {
    console.log(req.body)

    const { user } = req
    const fleetToUpdate = req.body

    console.log(`Updating fleet for user ${user.username} with ${JSON.stringify(fleetToUpdate)}`)

    let updatedFleet

    try {
        updatedFleet = await updateFleet(fleetToUpdate, user)
    } catch (err) {
        const [statusCode, errorMessage] = getValidationError(err)

        res.status(statusCode).send({
            error: errorMessage
        })
        return
    }

    if (updatedFleet) {
        res.send(updatedFleet)
    } else {
        res.status(404).send({
            error: `Fleet ID ${fleetId} does not exist`
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
        res.send(deletedFleet)
    } else {
        res.status(401).send('Unauthorized')
    }
}
