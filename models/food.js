const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    food_id: {
        type: String,
        required: true,
        unique: true,
    },
    food_name: {
        type: String,
        required: true,
        maxlength: 45,
    },
    food_price: {
        type: Number,
        required: true,
    },
    food_price_discount: {
        type: Number,
        required: true,
    },
    food_description: {
        type: String,
        required: true,
    },
    food_image_url: {
        type: String,
        maxlength: 255,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    category_id: {
        type: Number,
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
})

const Food = mongoose.model('foods', foodSchema)

module.exports = { Food }