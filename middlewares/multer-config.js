const multer = require('multer')
const utils = require('../utils')
const config = require('../config')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloudinary } = require('./cloudinary-config')

const foodStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const foodId = utils.getFoodIdFromReq(req)
        const publicId = utils.generateHash(foodId)
        return {
            folder: config.UPLOAD_IMAGE.FOLDERS.FOOD,
            format: config.UPLOAD_IMAGE.OPTION.FORMAT,
            public_id: publicId,
        }
    }
})

const foodUpload = multer({ storage: foodStorage })

module.exports = { foodUpload }
