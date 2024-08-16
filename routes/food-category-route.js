const express = require('express')
const { DB_NAME } = require('../config')
const category = require('../controllers/food-category-controller')
const categoryMongo = require('../controllers/mongoose/food-category-controller-mongo')

const router = express.Router()

router.get('/', DB_NAME == 'mongoDB' ? categoryMongo.getCategory : category.getCategory)
router.post('/', DB_NAME == 'mongoDB' ? categoryMongo.createCategory : category.createCategory)
router.put('/:category_id', DB_NAME == 'mongoDB' ? categoryMongo.updateCategory : category.updateCategory)
router.delete('/:category_id', DB_NAME == 'mongoDB' ? categoryMongo.deleteCategory : category.deleteCategory)

module.exports = router