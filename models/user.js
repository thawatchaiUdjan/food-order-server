const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        maxlength: 45,
    },
    password: {
        type: String,
        maxlength: 100,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        maxlength: 45,
        default: 'user'
    },
    balance: {
        type: Number,
        default: 0
    },
    location: {
        address: {
            type: String,
        },
        latlng: {
            lat: { type: Number },
            lng: { type: Number },
        }
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

const User = mongoose.model('users', userSchema)

module.exports = { User }