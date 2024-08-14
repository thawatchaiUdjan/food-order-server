const express = require('express')
const { foodUpload } = require('../middlewares/multer-config')
const { DB_NAME } = require('../config')
const food = require('../controllers/food-controller')
const foodMongo = require('../controllers/mongoose/food-controller-mongo')

const router = express.Router()

router.get('/', DB_NAME == 'mongoDB' ? foodMongo.getFoods : food.getFoods)
router.get('/:food_id', DB_NAME == 'mongoDB' ? foodMongo.getFoodById : food.getFoodById)
router.post('/', foodUpload.single('food_image_url'), DB_NAME == 'mongoDB' ? foodMongo.createFood : food.createFood)
router.put('/:food_id', foodUpload.single('food_image_url'), DB_NAME == 'mongoDB' ? foodMongo.updateFood : food.updateFood)
router.delete('/:food_id', DB_NAME == 'mongoDB' ? foodMongo.deleteFood : food.deleteFood)

module.exports = router