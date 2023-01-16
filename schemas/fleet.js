import mongoose from 'mongoose'

const Schema = mongoose.Schema

// TODO: add rating
export const FleetSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 128
    },
    description: {
        type: String,
        trim: true,
        maxlength: 4096
    },
    pointCost: {
        type: Number,
        min: 1
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    ships: [{
        ship: {
            type: Schema.Types.ObjectId,
            ref: 'CsgModel'
        },
        attachments: [{
            type: Schema.Types.ObjectId,
            ref: 'CsgModel'
        }]
    }],
    forts: [{ type: Schema.Types.ObjectId, ref: 'CsgModel' }],
    unassigned: [{
        type: Schema.Types.ObjectId,
        ref: 'CsgModel'
    }],
    uniqueTreasure: [{
        type: Schema.Types.ObjectId,
        ref: 'CsgModel'
    }]
}, { timestamps: true })

export default mongoose.model('Fleet', FleetSchema)

