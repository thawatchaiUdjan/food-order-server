const express = require('express')
const { foodUpload } = require('../middlewares/multer-config')
const food = require('../controllers/food-controller')

const router = express.Router()

router.get('/', food.getFoods)
router.get('/:food_id', food.getFoodById)
router.post('/', foodUpload.single('food_image_url'), food.createFood)
router.put('/:food_id', foodUpload.single('food_image_url'), food.updateFood)
router.delete('/:food_id', food.deleteFood)

module.exports = router