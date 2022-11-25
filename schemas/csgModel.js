import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const CsgModelSchema = new Schema({
    id: { type: String, trim: true, required: true },
    rarity: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(val) {
                const rarityList = [
                    '1 of 1',
                     'Common',
                     'LE',
                     'PR',
                     'Promo',
                     'Rare',
                     'SE',
                     'Special',
                     'Super Rare',
                     'Uncommon'
                ]
                return rarityList.includes(val)
            }
        }
    },
    set: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(val) {
                const piratesSetList = [
                    'Revolution Unlimited',
                    'Frozen North',
                    'Spanish Main Unlimited',
                    'Mysterious Islands',
                    'Barbary Coast',
                    'Rise of the Fiends',
                    'Crimson Coast',
                    'Oceans Edge',
                    'Davy Jones Curse',
                    'Caribbean',
                    'Unreleased',
                    'South China Seas',
                    'Spanish Main First Edition',
                    'Savage Shores',
                    'Return to Savage Shores',
                    'Barbary Coast Unlimited',
                    'Fire and Steel',
                    'Revolution'
                ]
                return piratesSetList.includes(val)
            }
        }
    },
    faction: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(val) {
                const factionList = [
                    'Viking',
                    'Mercenary',
                    'Jade Rebellion',
                    'Barbary Corsair',
                    'Pirate',
                    'UT',
                    'None',
                    'English',
                    "Whitebeard's Raiders",
                    'Spanish',
                    'French',
                    'American',
                    'Cursed'
                ]
                return factionList.includes(val)
            }
        }
    },
    type: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function(val) {
                const modelTypes = [
                    'Fort',
                    'Story',
                    'Island',
                    'Treasure',
                    'Equipment',
                    'Crew',
                    'Bust',
                    'Event',
                    'Crew/T',
                    'Ship'
                ]
                return modelTypes.includes(val)
            }
        }
    },
    name: { type: String, trim: true, required: true },
    pointCost: {
        type: Number,
        validate: {
            validator: function(val) {
                return ['Ship', 'Crew'].includes(this.type) && val >= 0
            }
        },
    },
    masts: {
        type: Number,
        validate: {
            validator: function(val) {
                return this.type === 'Ship' && val >= 0
            }
        },
    },
    cargo: {
        type: Number,
        validate: {
            validator: function(val) {
                return this.type === 'Ship' && val >= 0
            }
        },
    },
    baseMove: {
        type: String,
        validate: {
            validator: function(val) {
                const baseMoveList = [
                    'L',
                    'L+L+L',
                    'S',
                    'L+S',
                    'S+L',
                    'D',
                    'L+L',
                    'S+S+S',
                    'T',
                    'S+S'
                ]
                return this.type === 'Ship' && baseMoveList.includes(val)
            }
        },
    },
    cannons: {
        type: String,
        trim: true,
        validate: {
            validator: function(val) {
                const cannonsRegExp = /(([1-5][LS][-])*([1-5][LS])$)/
                return cannonsRegExp.test(val)
            },
            message: 'Invalid cannons'
        }
    },
    link: { type: String, trim: true },
    ability: { type: String, trim: true },
    flavorText: { type: String, trim: true },
    treasureValues: [Number],
    keywords: [String],
    image: String
})

export default mongoose.model('CsgModel', CsgModelSchema)

