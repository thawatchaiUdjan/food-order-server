const express = require('express')
const { DB_NAME } = require('../config')
const deliveryMongo = require('../controllers/mongoose/delivery-controller-mongo')

const router = express.Router()

router.get('/', DB_NAME == 'mongoDB' ? deliveryMongo.getDelivery : (req, res) => { res.status(200) })
// router.post('/', DB_NAME == 'mongoDB' ? categoryMongo.createCategory : category.createCategory)
// router.put('/:category_id', DB_NAME == 'mongoDB' ? categoryMongo.updateCategory : category.updateCategory)
// router.delete('/:category_id', DB_NAME == 'mongoDB' ? categoryMongo.deleteCategory : category.deleteCategory)

module.exports = router