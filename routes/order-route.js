const express = require('express')
const { DB_NAME } = require('../config')
const order = require('../controllers/order-controller')
const orderMongo = require('../controllers/mongoose/order-controller-mongo')

const router = express.Router()

router.post('/', DB_NAME == 'mongoDB' ? orderMongo.createOrder : order.createOrder)
router.put('/:orderId/:orderStatus', DB_NAME == 'mongoDB' ? orderMongo.updateStatus : order.updateStatus)
router.get('/all-order', DB_NAME == 'mongoDB' ? orderMongo.getOrders : order.getOrders)
router.get('/', DB_NAME == 'mongoDB' ? orderMongo.getOrder : order.getOrder)
router.delete('/:orderId', DB_NAME == 'mongoDB' ? orderMongo.deleteOrder : order.deleteOrder)

module.exports = router