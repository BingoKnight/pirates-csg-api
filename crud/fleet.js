import Fleet from '../schemas/fleet.js'

async function populate(query) {
    return query
        .populate('ships.ship', '-__v')
        .populate('ships.attachments', '-__v')
        .populate('forts', '-__v')
        .populate('events', '-__v')
        .populate('unassigned', '-__v')
        .populate('uniqueTreasure', '-__v')
        .select('-__v')
}

export async function getFleetList(pageNumber, pageLimit) {
    const safePageNumber = pageNumber > 0 ? pageNumber : 1

    return await populate(
        Fleet.find({})
        .skip((safePageNumber - 1) * pageLimit)
        .limit(pageLimit + 1)
    )
}

export async function getFleetTotalCount() {
    return await Fleet.countDocuments({})
}

export async function getFleetById(fleetId) {
    return await populate(Fleet.findOne({ _id: fleetId }))
}

export async function createFleet(newFleet) {
    return await Fleet.create(newFleet)
}

export async function updateFleet(fleetToUpdate) {
    return await populate(
        Fleet.findOneAndReplace(
            { user: fleetToUpdate.user, _id: fleetToUpdate._id },
            fleetToUpdate,
            { new: true }
        )
    )
}

export async function deleteFleet(fleetToDelete, user) {
    return await populate(
        Fleet.findOneAndDelete(
            { user, _id: fleetToDelete._id },
            fleetToDelete
        )
    )
}
