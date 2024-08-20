const mongoose = require('mongoose')

const optionChoiceSchema = new mongoose.Schema({
    choice_name: {
        type: String,
        required: true,
        maxlength: 48
    },
    choice_price: {
        type: Number,
        required: true,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
})

const OptionChoice = mongoose.model('option_choices', optionChoiceSchema)

module.exports = { OptionChoice }