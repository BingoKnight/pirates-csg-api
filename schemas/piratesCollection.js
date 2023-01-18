import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const PiratesCollectionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'CsgModel' },
    count: Number
})

export default mongoose.model('PiratesCollection', PiratesCollectionSchema)

