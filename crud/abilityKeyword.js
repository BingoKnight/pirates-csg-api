import AbilityKeyword from '../schemas/abilityKeyword.js'

export async function addKeyword(keyword) {
    const { name } = keyword
    return await AbilityKeyword.updateOne({ name }, keyword, { upsert: true })
        .exec()
        .catch(err => {
            console.log(err)
            return err
        })
}

export async function getKeywords(queryParams = {}) {
    return await AbilityKeyword.find(queryParams).select('-__v').exec()
}

