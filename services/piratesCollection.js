import { findCsgModelsByObjectIds } from '../crud/csgModel.js'
import { addToCollection, getUserCollection, removeFromCollection } from '../crud/piratesCollection.js'

export async function collectionUpdateHandler(req, res) {
    console.log(req.body)

    const { user } = req
    const { collection } = req.body

    console.log(`Updating collection for user ${user.username} with ${JSON.stringify(collection)}`)

    const csgItems = await findCsgModelsByObjectIds(collection.map(item => item.itemId))
    const csgItemIds = csgItems.map(csgItem => csgItem._id.toString())

    const missingIds = collection.filter(collectionItem => !csgItemIds.includes(collectionItem.itemId))

    if(missingIds.length > 0) {
        console.log(`Request includes invalid CSG Item ID's: [${missingIds}]`)
        res.status(400).send({
            error: 'Invalid ID\'s',
            ids: missingIds
        })
        return
    }

    const collectionToAdd = collection.map(item => {
        return {
            ...item,
            count: parseInt(item.count) || 1
        }
    })
    const addResult = await addToCollection(collectionToAdd, user)
    console.log(addResult)

    const userCollection = await getUserCollection(user)

    res.send({
        count: userCollection.length,
        collection: userCollection
    })
}

export async function collectionRemoveHandler(req, res) {
    console.log(req.query)

    if(!req.query?.id) {
        res.send()
        return
    }

    const { user } = req

    const itemIds = Array.isArray(req.query.id) ? req.query.id : [req.query.id]

    console.log(`Removing the following items for user ${user.username}: ${JSON.stringify(itemIds)}`)

    const removeResult = await removeFromCollection(itemIds, user)
    console.log(removeResult)

    const userCollection = await getUserCollection(user)

    res.send({
        count: userCollection.length,
        collection: userCollection
    })
}

export async function collectionGetHandler(req, res) {
    const { user } = req

    console.log(`Getting collection for user ${user.username}`)

    const userCollection = await getUserCollection(user)

    res.send({
        count: userCollection.length,
        collection: userCollection
    })
}

