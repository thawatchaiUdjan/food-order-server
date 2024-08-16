const mongoose = require('mongoose')

const foodCategorySchema = new mongoose.Schema({
    category_id: {
        type: String,
        required: true,
        unique: true,
    },
    category_name: {
        type: String,
        required: true,
        maxlength: 45,
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

const FoodCategory = mongoose.model('food_categories', foodCategorySchema)

module.exports = { FoodCategory }