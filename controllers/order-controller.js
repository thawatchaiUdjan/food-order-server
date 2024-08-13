const utils = require('../utils')
const config = require('../config')
const { connectDB } = require('../db')

const createOrder = async (req, res) => {
    const db = await connectDB()
    const foods = req.body.foods
    let order = req.body.order
    try {
        order.order_id = utils.generateUuid()
        order.user_id = req.user.user_id
        await db.query('INSERT INTO orders SET ?', order)
        foods.map(async food => {
            const orderFood = {
                order_id: order.order_id,
                food_id: food.food.food_id,
                food_amount: food.amount,
                food_total_price: food.total,
            }
            await db.query('INSERT INTO order_foods SET ?', orderFood)
        })
        const foodOrder = await getFoodOrderByUserId(db, order.user_id)
        res.status(201).json({
            message: config.RES_MESSAGES.SUCCESS.ORDER_ADDED,
            foodOrder: foodOrder,
        })
    } catch (err) {
        console.log('Error creating order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_CREATION_FAILED })
    } finally {
        await db.end()
    }
}

const getOrder = async (req, res) => {
    const db = await connectDB()
    try {
        const result = await getFoodOrderByUserId(db, req.user.user_id)
        res.status(200).json(result)
    } catch (err) {
        console.log('Error getting food order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_LOAD_FAILED })
    } finally {
        await db.end()
    }
}

const getOrders = async (req, res) => {
    const db = await connectDB()
    try {
        const result = await db.query(`
            SELECT * FROM orders INNER JOIN users
            ON orders.user_id = users.user_id
        `)
        res.status(200).json(result[0])
    } catch (err) {
        console.log('Error getting orders: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_LOAD_FAILED })
    } finally {
        await db.end()
    }
}

const updateStatus = async (req, res) => {
    const db = await connectDB()
    const { orderId, orderStatus } = req.params
    try {
        await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [orderStatus, orderId])
        const order = await db.query('SELECT * FROM orders WHERE order_id = ?', orderId)
        res.status(200).json({ 
            message: config.RES_MESSAGES.SUCCESS.ORDER_STATUS_UPDATED,
            order: order[0][0],
        })
    } catch (err) {
        console.log('Error updating order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_STATUS_UPDATE_FAILED })
    } finally {
        await db.end()
    }
}

const deleteOrder = async (req, res) => {
    const db = await connectDB()
    const orderId = req.params.orderId
    try {
        await db.query('DELETE FROM orders WHERE order_id = ?', orderId)
        res.status(200).json({ message: config.RES_MESSAGES.SUCCESS.ORDER_CANCELED })
    } catch (err) {
        console.log('Error deleting order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_DELETE_FAILED })
    } finally {
        await db.end()
    }
}

const getOrderByUserId = async (db, userId) => {
    const result = await db.query('SELECT * FROM orders WHERE user_id = ?', userId)
    return result[0][0]
}

const getFoodByOrderId = async (db, orderId) => {
    const result = await db.query(`
    SELECT * FROM order_foods INNER JOIN foods  
    ON 
      order_foods.food_id = foods.food_id
    WHERE 
      order_foods.order_id = ?
    `, orderId)
    return result[0]
}

const getFoodOrderByUserId = async (db, userId) => {
    const order = await getOrderByUserId(db, userId)
    if (order) {
        const foods = await getFoodByOrderId(db, order.order_id)
        return {
            order: order,
            foods: foods,
        }
    } else {
        return null
    }
}

module.exports = {
    createOrder,
    updateStatus,
    getOrders,
    getOrder,
    deleteOrder,
}