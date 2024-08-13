const config = require('./config')
const { cloudinary } = require('./middlewares/cloudinary-config')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const deleteImageFile = async (image_url, image_folder = '') => {
    if (image_url) {
        let publicId = image_url.split('/').pop().split('.')[0]
        if (image_folder) {
            publicId = `${image_folder}/${publicId}`
        }
        await cloudinary.uploader.destroy(publicId)
    }
}

const generateUuid = () => {
    return uuidv4()
}

const generateHash = (input) => {
    return crypto.createHash(config.HASH.HASH_ALGORITHM).update(input).digest(config.HASH.HASH_ENCODING)
}

const getFoodIdFromReq = (req) => {
    let foodId = req.params.food_id
    if (!foodId) {
        foodId = generateUuid()
        req.params.food_id = foodId
    }
    return foodId
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(config.ENCRYPT_SALT_ROUNDS)
    return await bcrypt.hash(password, salt)
}

async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = {
    deleteImageFile,
    generateUuid,
    generateHash,
    getFoodIdFromReq,
    hashPassword,
    verifyPassword,
}