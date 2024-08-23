const { FoodOption } = require("../../models/food-option")
const utils = require('../../utils')
const config = require("../../config")

const getFoodOption = async (req, res) => {
    try {
        const result = await FoodOption.find().populate('option_choices')
        res.status(200).json(result)
    } catch (err) {
        console.log(`${config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED}:`, err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.LOAD_DATA_FAILED })
    }
}

module.exports = {
    getFoodOption,
}