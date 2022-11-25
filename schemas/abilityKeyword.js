import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const AbilityKeywordSchema = new Schema({
    name: String,
    definition: String
})

export default mongoose.model('AbilityKeyword', AbilityKeywordSchema)

