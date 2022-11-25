import CsgModel from '../schemas/csgModel.js'
import _ from 'lodash'

export async function importCsgModels(csgModelArray) {
    let failedImports = []
    csgModelArray.forEach(async csgModel => {
        const { id, set, name } = csgModel
        await CsgModel.updateOne({ id, set, name }, csgModel, { upsert: true })
            .exec()
            .catch(err => {
                console.log(err)
                failedImports.push(csgModel)
            })
    })
    return failedImports
}

function baseQuery(queryParams = {}) {
    return CsgModel
        .find(queryParams)
        .select('-__v')  // ignore built in fields
}

export async function queryCsgModels(queryParams = {}) {
    function equalsExact(key, value) { // fix so that it is exact but case insensitive
        return {[key]: value}
    }

    function equalsLike(key, value) {
        if (value.constructor === Array)
            return {
                $and: value.map(val => ({
                    [key]: {$regex: new RegExp(_.escapeRegExp(val), 'i')}
                }))
            }

        // return {[key]: {$regex: _.escapeRegExp(value)}}
        return {[key]: {$regex: _.escapeRegExp(value), $options: 'i'}}
    }

    function lessThanEqualTo(key, value) {
        return {[key]: {$lt: parseInt(value) + 1}}
    }

    function greaterThanEqualTo(key, value) {
        return {[key]: {$gt: parseInt(value) - 1}}
    }

    const validQueryKeys = {
        id: equalsExact,
        set: equalsLike,      // may remove in favor of front end dropdown
        faction: equalsLike,  // may remove in favor of front end dropdown
        type: equalsLike,     // may remove in favor of front end dropdown
        rarity: equalsExact,
        name: equalsLike,
        pointCost: equalsExact,
        minPointCost: (_, val) => greaterThanEqualTo('pointCost', val),
        maxPointCost: (_, val) => lessThanEqualTo('pointCost', val),
        masts: equalsExact,
        minMasts: (_, val) => greaterThanEqualTo('masts', val),
        maxMasts: (_, val) => lessThanEqualTo('masts', val),
        cargo: equalsExact,
        minCargo: (_, val) => greaterThanEqualTo('cargo', val),
        maxCargo: (_, val) => lessThanEqualTo('cargo', val),
        baseMove: equalsExact,
        cannons: equalsLike,
        link: equalsLike,
        ability: equalsLike,
        keywords: equalsLike,
        flavorText: equalsLike
    }

    const queryData = Object.entries(validQueryKeys)
        .filter(([key, _]) => queryParams[key])
        .reduce((acc, [key, queryFunc]) => ({...acc, ...queryFunc(key, queryParams[key])}), {})

    console.log(queryData)

    return await baseQuery(queryData).exec()
}

export async function findByObjectIds(objectIdList) {
    const query = {_id: objectIdList}
    console.log(query)
    return await baseQuery(query).exec()
}

