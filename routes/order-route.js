const express = require('express')
const order = require('../controllers/order-controller')

const router = express.Router()

router.post('/', order.createOrder)
router.put('/:orderId/:orderStatus', order.updateStatus)
router.get('/all-order', order.getOrders)
router.get('/', order.getOrder)
router.delete('/:orderId', order.deleteOrder)

module.exports = router