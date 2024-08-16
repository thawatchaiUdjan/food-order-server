const mongoose = require('mongoose')

const orderFoodSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    food_id: {
        type: String,
        required: true,
    },
    food_amount: {
        type: Number,
        required: true,
    },
    food_total_price: {
        type: Number,
        required: true,
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

const OrderFood = mongoose.model('order_foods', orderFoodSchema)

module.exports = { OrderFood }