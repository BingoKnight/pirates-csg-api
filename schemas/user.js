import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const User = new Schema({
    id: ObjectId,
    username: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: val => {
                return /^[a-zA-Z0-9-_]{4,20}$/.test(val)
            },
            message: 'Invalid username. Username may only consist of alphanumberic characters as well as hyphens (-) and underscores (_)'
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: { type: String, select: false },
    token: { type: String, trim: true, unique: true, select: false }
})

export default mongoose.model('User', User)

