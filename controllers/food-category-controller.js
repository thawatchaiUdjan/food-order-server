const utils = require('../utils')
const config = require('../config')
const { connectDB } = require('../db')

const getCategory = async (req, res) => {
    const db = await connectDB()
    try {
        const result = await db.query('SELECT * FROM food_categories')
        res.status(200).json(result[0])
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const createCategory = async (req, res) => {
    const db = await connectDB()
    const category = req.body
    try {
        const result = await db.query('INSERT INTO food_categories SET ?', category)
        const newCategory = await db.query('SELECT * FROM food_categories WHERE category_id = ?', result[0].insertId)
        res.status(201).json({
            // message: config.RES_MESSAGES.SUCCESS.FOOD_ADDED,
            category: newCategory[0][0],
        })
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const updateCategory = async (req, res) => {
    const db = await connectDB()
    const categoryId = req.params.category_id
    const category = req.body
    try {
        const result = await db.query('UPDATE food_categories SET ? WHERE category_id = ?', [category, categoryId])
        if (result[0].affectedRows > 0) {
            const updateCategory = await db.query('SELECT * FROM food_categories WHERE category_id = ?', categoryId)
            res.status(200).json({
                // message: config.RES_MESSAGES.SUCCESS.FOOD_UPDATED,
                category: updateCategory[0][0],
            })
        }
        else {
            res.status(404).json({ message: 'Category to update not found' })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

const deleteCategory = async (req, res) => {
    const db = await connectDB()
    const categoryId = req.params.category_id
    try {
        const result = await db.query('SELECT * FROM food_categories WHERE category_id = ?', categoryId)
        const category = result[0][0]
        if (category) {
            await db.query('DELETE FROM food_categories WHERE category_id = ?', categoryId)
            res.status(200).json({ message: 'Category deleted' })
        } else {
            res.status(404).json({ message: 'Category to delete not found' })
        }
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    } finally {
        await db.end()
    }
}

module.exports = {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}