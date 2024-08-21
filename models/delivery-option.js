const mongoose = require('mongoose')

const deliveryOptionSchema = new mongoose.Schema({
    delivery_name: {
        type: String,
        required: true,
        maxlength: 48
    },
    delivery_description: {
        type: String,
        required: true,
        length: 100
    },
    delivery_cost: {
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

const DeliveryOption = mongoose.model('delivery_options', deliveryOptionSchema)

module.exports = { DeliveryOption }