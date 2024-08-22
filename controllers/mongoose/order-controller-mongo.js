const { Order } = require("../../models/order")
const { OrderFood } = require("../../models/order-food")
const { OrderStatus } = require("../../models/order-status")
const utils = require('../../utils')
const config = require('../../config')

const createOrder = async (req, res) => {
    const foods = req.body.foods
    let order = req.body.order
    try {
        order.order_id = utils.generateUuid()
        order.user_id = req.user.user_id
        order.order_status = await getDefaultOrderStatus()
        const newOrder = new Order(order)
        await newOrder.save()
        foods.map(async food => {
            const orderFood = new OrderFood({
                order_id: order.order_id,
                food_id: food.food.food_id,
                food_amount: food.amount,
                food_total_price: food.total,
                food_option_string: food.option.option_string,
                food_option_note: food.option.option_note,
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
            {
                $lookup: {
                    from: 'order_statuses',
                    localField: 'order_status',
                    foreignField: '_id',
                    as: 'status'
                }
            },
            {
                $lookup: {
                    from: 'delivery_options',
                    localField: 'order_delivery_option',
                    foreignField: '_id',
                    as: 'delivery_option'
                }
            },
            { $unwind: '$user' },
            { $unwind: '$status' },
            { $unwind: '$delivery_option' },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$$ROOT', {
                            $mergeObjects: [
                                '$user',
                                '$status',
                            ]
                        }]
                    }
                }
            },
            {
                $project: {
                    user: 0,
                    status: 0,
                }
            },
        ])
        for (let order of result) {
            order.foods = await getFoodByOrderId(order.order_id)
        }
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
        .populate('order_status')
        .populate('order_delivery_option')
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
        { $project: { food: 0, food_options: 0, } }
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

const getDefaultOrderStatus = async () => {
    const result = await OrderStatus.findOne({ status_value: 0 })
    return result._id
}

module.exports = {
    createOrder,
    updateStatus,
    getOrders,
    getOrder,
    deleteOrder,
}