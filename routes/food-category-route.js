const express = require('express')
const category = require('../controllers/food-category-controller')

const router = express.Router()

router.get('/', category.getCategory)
router.post('/', category.createCategory)
router.put('/:category_id', category.updateCategory)
router.delete('/:category_id', category.deleteCategory)

module.exports = router