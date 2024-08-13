const utils = require('../utils')
const config = require('../config')
const auth = require('../middlewares/authentication')
const { connectDB } = require('../db')

const login = async (req, res) => {
    const db = await connectDB()
    const { username, password } = req.body
    try {
        const user = await getUserByUsername(db, username)
        if (user) {
            const match = await utils.verifyPassword(password, user.password)
            if (match) {
                const token = auth.createToken(user)
                res.status(200).json({
                    token: token,
                    user: user,
                })
            } else {
                res.status(401).json({ message: config.RES_MESSAGES.ERROR.USER_LOGIN_INVALID })
            }
        } else {
            res.status(401).json({ message: config.RES_MESSAGES.ERROR.USER_LOGIN_INVALID })
        }
    } catch (err) {
        console.log('Error login user: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.USER_LOGIN_FAILED })
    } finally {
        await db.end()
    }
}

const register = async (req, res) => {
    const db = await connectDB()
    let userData = req.body
    try {
        const userResult = await getUserByUsername(db, userData.username)
        if (!userResult) {
            const userId = utils.generateUuid()
            const hashedPassword = await utils.hashPassword(userData.password)
            userData.user_id = userId
            userData.password = hashedPassword
            await db.query('INSERT INTO users SET ?', userData)
            const result = await db.query('SELECT * FROM users WHERE user_id = ?', [userData.user_id])
            const user = result[0][0]
            const token = auth.createToken(user)
            res.status(200).json({
                token: token,
                user: user,
            })
        } else {
            res.status(401).json({ message: config.RES_MESSAGES.ERROR.USER_REGISTER_USERNAME_IN_USE })
        }
    } catch (err) {
        console.log('Error register user: ', err.message)
        res.status(500).json({ message: config.RES_MESSAGES.ERROR.USER_REGISTER_FAILED })
    } finally {
        await db.end()
    }
}

const getUserByUsername = async (db, username) => {
    const result = await db.query('SELECT * FROM users WHERE username = ?', username)
    return result[0][0]
}

const verify = async (req, res) => {
    res.status(200).send('verify complete')
}

module.exports = {
    login,
    register,
    verify,
}