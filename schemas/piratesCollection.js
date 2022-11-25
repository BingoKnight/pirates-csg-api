import mongoose from 'mongoose'

import { CsgModelSchema } from './csgModel.js'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

export const PiratesCollectionSchema = new Schema({
    id: ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    pirateCollection: [CsgModelSchema]
})

export default mongoose.model('PiratesCollection', PiratesCollectionSchema)

