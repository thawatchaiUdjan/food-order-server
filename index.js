const express = require('express')
const cors = require('cors')
const auth = require('./middlewares/authentication')
const bodyParser = require('body-parser')
const { connectMongoDB } = require('./db-mongoose')
const { DB_NAME } = require('./config')

const foodRoute = require('./routes/food-route')
const categoryRoute = require('./routes/food-category-route')
const userRoute = require('./routes/user-route')
const orderRoute = require('./routes/order-route')
const orderStatusRoute = require('./routes/order-status-route')
const deliveryRoute = require('./routes/delivery-route')

const app = express()
const port = parseInt(process.env.APP_PORT)

app.use(bodyParser.json())
app.use(cors())

app.use('/user', userRoute)
app.use('/foods', auth.verifyToken, foodRoute)
app.use('/category', auth.verifyToken, categoryRoute)
app.use('/orders', auth.verifyToken, orderRoute)
app.use('/order-status', orderStatusRoute)
app.use('/delivery', deliveryRoute)

app.listen(port, async (req, res) => {
    if (DB_NAME === 'mongoDB') await connectMongoDB()
    console.log('server running on port', port)
})