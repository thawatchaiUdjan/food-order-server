const express = require('express')
const { DB_NAME } = require('../config')
const orderStatus = require('../controllers/mongoose/order-status-controller-mongo')

const router = express.Router()

router.get('/', DB_NAME == 'mongoDB' ? orderStatus.getOrderStatus : (req, res) => { res.status(200) })
// router.post('/', DB_NAME == 'mongoDB' ? orderStatus.createCategory : category.createCategory)
// router.put('/:category_id', DB_NAME == 'mongoDB' ? orderStatus.updateCategory : category.updateCategory)
// router.delete('/:category_id', DB_NAME == 'mongoDB' ? orderStatus.deleteCategory : category.deleteCategory)

module.exports = router