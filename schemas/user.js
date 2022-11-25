import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = new Schema({
    id: ObjectId,
    name: { type: String, trim: true, unique: true },
    email: { type: String, trim: true, unique: true}
})

export default mongoose.model('User', User)

