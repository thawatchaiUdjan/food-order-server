const mongoose = require('mongoose')

const foodOptionSchema = new mongoose.Schema({
    option_name: {
        type: String,
        required: true,
        maxlength: 48
    },
    option_description: {
        type: String,
        required: true,
        default: 100
    },
    option_type: {
        type: String,
        enum: ['select', 'checkbox'],
        required: true,
    },
    option_choices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'option_choices'
    }],
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

const FoodOption = mongoose.model('food_options', foodOptionSchema)

module.exports = { FoodOption }