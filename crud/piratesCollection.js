import { getUser } from './user.js'
import { findByObjectIds } from '../crud/csgModel.js'
import PiratesCollection from '../schemas/piratesCollection.js'


export async function updateCollection(csgModelIdList, collectionOwner) {
    const user = await getUser(collectionOwner)

    const collectionModelArray = await findByObjectIds(csgModelIdList)

    let userCollection = await PiratesCollection.findOne({ user })

    if (userCollection) {
        userCollection.pirateCollection = collectionModelArray
    } else {
        userCollection = new PiratesCollection({ user, pirateCollection: collectionModelArray })
    }

    try {
        const result = await userCollection.save()
        return {piratesCollection: result.pirateCollection}
    } catch(err) {
        console.log(err)
        // return err
        return {
            errors: [
                Object.entries(err.errors).map(([k, v]) => (
                    {
                        name: v.name,
                        at: k,
                        message: v.message
                    }
                ))
            ]
        }
    }
}

export async function removeFromCollection(csgModelsList) {

}

export async function getCollectionList(user) {
    return {
        pirateCollection: (
            await PiratesCollection
                .findOne({user: await getUser(user)})
                .select('-_id -__v')
                .exec()
        ).pirateCollection
    }
}

