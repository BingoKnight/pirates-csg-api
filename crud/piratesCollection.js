import PiratesCollection from '../schemas/piratesCollection.js'


export async function addToCollection(collection, user) {
    return await Promise.all(
        collection.map(item => {
            return PiratesCollection.updateOne(
                { user: user._id, item: item.itemId },
                { item: item.itemId, count: item.count },
                { upsert: true }
            )
        })
    )
}

export async function getUserCollection(user) {
    return await PiratesCollection.find({ user: user._id})
        .populate('item', '-__v')
        .select('-_id -__v -user')
}


export async function removeFromCollection(itemIds, user) {
    return await PiratesCollection.deleteMany({ user: user._id, item: { $in: itemIds } })
}

