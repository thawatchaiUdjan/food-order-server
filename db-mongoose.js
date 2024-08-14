const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING_MONGO)
    } catch (err) {
        console.error('Failed to connect to MongoDB', err)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    await mongoose.disconnect()
}

module.exports = {
    connectDB,
    disconnectDB,
}
