const { User } = require("../../models/user")
const { OAuth2Client } = require('google-auth-library')
const utils = require('../../utils')
const config = require("../../config")
const auth = require('../../middlewares/authentication')

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
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRETE_ID, 'postmessage')
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
                const [firstName, lastName] = payload.name.split(' ');
                const newUser = new User({
                    user_id: userId,
                    username: payload.sub,
                    first_name: firstName,
                    last_name: lastName,
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
        console.log('Fail Google login:', err.message);
        res.status(500).json({ message: 'Fail to google login' })
    }
}

const getUserByUsername = async (username) => {
    const result = await User.findOne({ username: username })
    return result
}

module.exports = {
    login,
    register,
    googleLogin,
}