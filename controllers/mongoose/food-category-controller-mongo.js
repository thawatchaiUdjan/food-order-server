const { FoodCategory } = require("../../models/food-category");
const { connectDB, disconnectDB } = require("../../db-mongoose");
const utils = require('../../utils');
const config = require("../../config");

const getCategory = async (req, res) => {
    await connectDB()
    try {
        const result = await FoodCategory.find()
        res.status(200).json(result)
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await disconnectDB()
    }
}

const createCategory = async (req, res) => {
    await connectDB()
    const category = req.body
    try {
        const newCategory = new FoodCategory(category)
        await newCategory.save()
        res.status(201).json({
            // message: config.RES_MESSAGES.SUCCESS.FOOD_ADDED,
            category: newCategory,
        })
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await disconnectDB()
    }
}

const updateCategory = async (req, res) => {
    connectDB()
    const categoryId = req.params.category_id
    const category = req.body
    try {
        const result = await FoodCategory.findOneAndUpdate({ category_id: categoryId }, category, { new: true })
        if (result) {
            res.status(200).json({
                // message: config.RES_MESSAGES.SUCCESS.FOOD_UPDATED,
                category: result,
            })
        }
        else {
            res.status(404).json({ message: 'Category to update not found' })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await disconnectDB()
    }
}

const deleteCategory = async (req, res) => {
    await connectDB()
    const categoryId = req.params.category_id
    try {
        const result = await FoodCategory.findOneAndDelete({ category_id: categoryId })
        if (result) {
            res.status(200).json({ message: 'Category deleted' })
        } else {
            res.status(404).json({ message: 'Category to delete not found' })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await disconnectDB()
    }
}

module.exports = {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}