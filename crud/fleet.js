import Fleet from '../schemas/fleet.js'

export async function getFleetList(pageNumber, pageLimit) {
    const safePageNumber = pageNumber > 0 ? pageNumber : 1

    return await Fleet.find({})
        .skip((safePageNumber - 1) * pageLimit)
        .limit(pageLimit + 1)
        .populate('models', '-__v')
        .select('-__v')
}

export async function getFleetTotalCount() {
    return await Fleet.countDocuments({})
}

export async function getFleetById(fleetId) {
    return await Fleet.findOne({ _id: fleetId })
        .populate('models', '-__v')
        .select('-__v')
}

export async function createFleet(newFleet) {
    return await Fleet.create(newFleet)
}

export async function updateFleet(fleetToUpdate, user) {
    return await Fleet.findOneAndUpdate(
            { user, _id: fleetToUpdate._id },
            fleetToUpdate,
            { returnOriginal: false }
        )
        .populate('models', '-__v')
        .select('-__v')
}

export async function deleteFleet(fleetToDelete, user) {
    return await Fleet.findOneAndDelete(
            { user, _id: fleetToDelete._id },
            fleetToDelete
        )
        .populate('models', '-__v')
        .select('-__v')
}
