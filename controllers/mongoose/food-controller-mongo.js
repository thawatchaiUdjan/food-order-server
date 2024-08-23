const { Food } = require("../../models/food")
const utils = require('../../utils')
const config = require('../../config')

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find()
            .sort({ created_at: -1 })
            .populate({
                path: 'food_options',
                populate: {
                    path: 'option_choices',
                }
            })
        res.status(200).json(foods)
    } catch (err) {
        console.error('Error fetching foods:', err.message)
        res.status(500).json({ message: 'Failed to load data' })
    }
}

const getFoodById = async (req, res) => {
    const foodId = req.food_id
    try {
        const result = Food.findOne({ food_id: foodId })
        if (result) {
            res.status(200).json(result)
        }
        else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_NOT_FOUND })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    }
}

const createFood = async (req, res) => {
    const foodId = utils.getFoodIdFromReq(req)
    let food = req.body
    try {
        if (req.file) food.food_image_url = req.file.path
        food.food_id = foodId
        const newFood = new Food(food)
        await newFood.save()
        res.status(201).json({
            message: 'Food added successfully',
            food: newFood
        })
    } catch (err) {
        console.error('Error adding food:', err.message)
        res.status(500).json({ message: 'Failed to add food' })
    }
}

const updateFood = async (req, res) => {
    const foodId = req.params.food_id
    let food = req.body
    try {
        if (req.file) food.food_image_url = req.file.path
        const result = await Food
            .findOneAndUpdate({ food_id: foodId }, food, { new: true })
            .populate({
                path: 'food_options',
                populate: {
                    path: 'option_choices',
                }
            })
        if (result) {
            res.status(200).json({
                message: config.RES_MESSAGES.SUCCESS.FOOD_UPDATED,
                food: result,
            })
        }
        else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_UPDATE_FAILED })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    }
}

const deleteFood = async (req, res) => {
    const foodId = req.params.food_id
    try {
        const food = await Food.findOneAndDelete({ food_id: foodId })
        if (food) {
            await utils.deleteImageFile(food.food_image_url, config.UPLOAD_IMAGE.FOLDERS.FOOD)
            res.status(200).json({ message: config.RES_MESSAGES.SUCCESS.FOOD_DELETED })
        } else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_DELETE_FAILED })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    }
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
}