const mongoose = require('mongoose')

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING_MONGO)
        console.error('Success to connect to MongoDB')
    } catch (err) {
        console.error('Failed to connect to MongoDB', err)
        process.exit(1)
    }
}

module.exports = { connectMongoDB }