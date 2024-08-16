const { Order } = require("../../models/order");
const { OrderFood } = require("../../models/order-food");
const utils = require('../../utils')
const config = require('../../config')

const createOrder = async (req, res) => {
    const foods = req.body.foods
    let order = req.body.order
    try {
        order.order_id = utils.generateUuid()
        order.user_id = req.user.user_id
        const newOrder = new Order(order)
        await newOrder.save()
        foods.map(async food => {
            const orderFood = new OrderFood({
                order_id: order.order_id,
                food_id: food.food.food_id,
                food_amount: food.amount,
                food_total_price: food.total,
            })
            await orderFood.save()
        })
        const foodOrder = await getFoodOrderByUserId(order.user_id)
        res.status(201).json({
            message: config.RES_MESSAGES.SUCCESS.ORDER_ADDED,
            foodOrder: foodOrder,
        })
    } catch (err) {
        console.log('Error creating order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_CREATION_FAILED })
    }
}

const getOrder = async (req, res) => {
    try {
        const result = await getFoodOrderByUserId(req.user.user_id)
        res.status(200).json(result)
    } catch (err) {
        console.log('Error getting food order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_LOAD_FAILED })
    }
}

const getOrders = async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$user'] } } },
            { $project: { user: 0 } }
        ])
        res.status(200).json(result)
    } catch (err) {
        console.log('Error getting orders: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_LOAD_FAILED })
    }
}

const updateStatus = async (req, res) => {
    const { orderId, orderStatus } = req.params
    try {
        const order = await Order.findOneAndUpdate({ order_id: orderId }, { order_status: orderStatus }, { new: true })
        res.status(200).json({
            message: config.RES_MESSAGES.SUCCESS.ORDER_STATUS_UPDATED,
            order: order,
        })
    } catch (err) {
        console.log('Error updating order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_STATUS_UPDATE_FAILED })
    }
}

const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId
    try {
        await Order.findOneAndDelete({ order_id: orderId })
        res.status(200).json({ message: config.RES_MESSAGES.SUCCESS.ORDER_CANCELED })
    } catch (err) {
        console.log('Error deleting order: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.ORDER_DELETE_FAILED })
    }
}

const getOrderByUserId = async (userId) => {
    const result = await Order.findOne({ user_id: userId })
    return result
}

const getFoodByOrderId = async (orderId) => {
    const result = await OrderFood.aggregate([
        { $match: { order_id: orderId } },
        {
            $lookup: {
                from: 'foods',
                localField: 'food_id',
                foreignField: 'food_id',
                as: 'food'
            }
        },
        { $unwind: '$food' },
        { $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$food'] } } },
        { $project: { food: 0 } }
    ])
    return result
}

const getFoodOrderByUserId = async (userId) => {
    const order = await getOrderByUserId(userId)
    if (order) {
        const foods = await getFoodByOrderId(order.order_id)
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