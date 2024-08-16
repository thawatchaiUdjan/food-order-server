const mongoose = require('mongoose')
const { OrderFood } = require('./order-food')

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    subtotal_price: {
        type: Number,
        required: true,
    },
    delivery_price: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    order_address: {
        type: String,
        maxlength: 255,
    },
    order_status: {
        type: Number,
        default: 0,
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

orderSchema.pre('findOneAndDelete', async function (next) {
    const orderId = this.getQuery()['order_id']
    await OrderFood.deleteMany({ order_id: orderId })
    next()
})

const Order = mongoose.model('orders', orderSchema)

module.exports = { Order }