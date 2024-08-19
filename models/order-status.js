const mongoose = require('mongoose')

const orderStatusSchema = new mongoose.Schema({
    status_name: {
        type: String,
        required: true,
        maxlength: 45,
    },
    status_value: {
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

const OrderStatus = mongoose.model('order_statuses', orderStatusSchema)

module.exports = { OrderStatus }