import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

export const PiratesCollectionSchema = new Schema({
    id: ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'CsgModel', unique: true },
    count: Number
})

export default mongoose.model('PiratesCollection', PiratesCollectionSchema)

