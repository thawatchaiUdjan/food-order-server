const { User } = require("../../models/user")
const { Order } = require("../../models/order")
const { OAuth2Client } = require('google-auth-library')
const utils = require('../../utils')
const config = require("../../config")
const auth = require('../../middlewares/authentication')
const passport = require('../../middlewares/passport-facebook-config')

const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await getUserByUsername(username)
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
    }
}

const register = async (req, res) => {
    let userData = req.body
    try {
        const userResult = await getUserByUsername(userData.username)
        if (!userResult) {
            const userId = utils.generateUuid()
            const hashedPassword = await utils.hashPassword(userData.password)
            userData.user_id = userId
            userData.password = hashedPassword
            const user = new User(userData)
            await user.save()
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
    }
}

const googleLogin = async (req, res) => {
    const code = req.body.code
    try {
        if (code) {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET_ID, 'postmessage')
            const { tokens } = await client.getToken(code)
            const ticket = await client.verifyIdToken({ idToken: tokens.id_token })
            const payload = ticket.getPayload()
            const user = await getUserByUsername(payload.sub)
            if (user) {
                const token = auth.createToken(user)
                res.status(200).json({
                    token: token,
                    user: user,
                })
            } else {
                const userId = utils.generateUuid()
                const newUser = new User({
                    user_id: userId,
                    username: payload.sub,
                    name: payload.name,
                })
                await newUser.save()
                const token = auth.createToken(newUser)
                res.status(200).json({
                    token: token,
                    user: newUser,
                })
            }
        } else {
            res.status(401).json({ message: 'No Google code provided' })
        }
    } catch (err) {
        console.log('Fail Google login:', err.message)
        res.status(500).json({ message: 'Fail to google login' })
    }
}

const facebookLogin = async (req, res) => {
    const accessToken = req.body.access_token
    if (accessToken) {
        passport.authenticate('facebook-token', { session: false }, async (err, user, info) => {
            if (user) {
                const userData = await getUserByUsername(user.id)
                if (userData) {
                    const token = auth.createToken(userData)
                    res.status(200).json({
                        token: token,
                        user: userData,
                    })
                } else {
                    const userId = utils.generateUuid()
                    const newUser = new User({
                        user_id: userId,
                        username: user.id,
                        name: `${user.first_name} ${user.last_name}`,
                    })
                    await newUser.save()
                    const token = auth.createToken(newUser)
                    res.status(200).json({
                        token: token,
                        user: newUser,
                    })
                }
            } else {
                console.log('Fail facebook login:', err)
                res.status(401).json({ message: 'Fail to facebook login' })
            }
        })(req, res)
    } else {
        console.log('No facebook access token provided')
        res.status(401).json({ message: 'No facebook access token provided' })
    }
}

const getUser = async (req, res) => {
    try {
        const result = await User.findOne({ user_id: req.user.user_id })
        res.status(200).json({
            token: req.token,
            user: result,
        })
    } catch (err) {
        console.log('Error get user data:', err.message)
        res.status(500).json({ message: 'Error get user data' })
    }
}

const updateUser = async (req, res) => {
    const userId = req.user.user_id
    const userData = req.body
    try {
        const user = await updateUserData(userId, userData)
        res.status(200).json({
            message: 'User data successfully updated',
            user: user,
        })
    } catch (err) {
        console.log('Fail to update user data:', err.message)
        res.status(500).json({ message: 'Fail to update user data' })
    }
}

const deleteUser = async (req, res) => {
    const userId = req.user.user_id
    try {
        const result = await Order.findOne({ user_id: userId })
        if (result) {
            throw new Error('account already have an order')
        } else {
            await User.deleteOne({ user_id: userId })
            res.status(200).json({ message: 'Delete account successfully' })
        }
    } catch (err) {
        console.log('Fail to delete account:', err.message)
        res.status(500).json({ message: 'Fail to delete account' })
    }
}

const getUserByUsername = async (username) => {
    const result = await User.findOne({ username: username })
    return result
}

const updateUserData = async (userId, data) => {
    const user = await User.findOneAndUpdate({ user_id: userId }, data, { new: true })
    const token = auth.createToken(user)
    return { user, token }
}

module.exports = {
    getUser,
    deleteUser,
    login,
    register,
    googleLogin,
    facebookLogin,
    updateUser,
    updateUserData,
}