const mysql = require('mysql2/promise')
const fs = require('fs')
const config = require('./config')

const connectDB = async () => {
    try {
        return await mysql.createConnection(process.env.DB_CONNECTION_STRING)
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.DB_CONNECTION_FAILED}: `, err.message)
        throw err
    }
}

module.exports = { connectDB }