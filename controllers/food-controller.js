const utils = require('../utils')
const config = require('../config')
const { connectDB } = require('../db')

const getFoods = async (req, res) => {
    const db = await connectDB()
    try {
        const result = await db.query('SELECT * FROM foods ORDER BY created_at DESC')
        res.status(200).json(result[0])
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const getFoodById = async (req, res) => {
    const db = await connectDB()
    const foodId = req.food_id
    try {
        const result = await db.query('SELECT * FROM foods WHERE food_id = ?', foodId)
        const food = result[0][0]
        if (food) {
            res.status(200).json(food)
        }
        else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_NOT_FOUND })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const createFood = async (req, res) => {
    const db = await connectDB()
    const foodId = utils.getFoodIdFromReq(req)
    let food = req.body    
    try {
        if (req.file) food.food_image_url = req.file.path
        food.food_id = foodId
        await db.query('INSERT INTO foods SET ?', food)
        const newFood = await db.query('SELECT * FROM foods WHERE food_id = ?', foodId)
        res.status(201).json({
            message: config.RES_MESSAGES.SUCCESS.FOOD_ADDED,
            food: newFood[0][0],
        })
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const updateFood = async (req, res) => {
    const db = await connectDB()
    const foodId = req.params.food_id
    let food = req.body
    try {
        if (req.file) food.food_image_url = req.file.path
        const result = await db.query('UPDATE foods SET ? WHERE food_id = ?', [food, foodId])
        if (result[0].affectedRows > 0) {
            const updateFood = await db.query('SELECT * FROM foods WHERE food_id = ?', foodId)
            res.status(200).json({
                message: config.RES_MESSAGES.SUCCESS.FOOD_UPDATED,
                food: updateFood[0][0],
            })
        }
        else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_UPDATE_FAILED })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const deleteFood = async (req, res) => {
    const db = await connectDB()
    const foodId = req.params.food_id
    try {
        const resultFood = await db.query('SELECT * FROM foods WHERE food_id = ?', foodId)
        const food = resultFood[0][0]
        if (food) {
            await utils.deleteImageFile(food.food_image_url, config.UPLOAD_IMAGE.FOLDERS.FOOD)
            await db.query('DELETE FROM foods WHERE food_id = ?', foodId)
            res.status(200).json({ message: config.RES_MESSAGES.SUCCESS.FOOD_DELETED })
        } else {
            res.status(404).json({ message: config.RES_MESSAGES.ERROR.FOOD_DELETE_FAILED })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
}