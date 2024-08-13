const jwt = require('jsonwebtoken')
const config = require('../config')

const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded.user;
            next();
        } catch (err) {
            if (err.name === config.TOKEN.TOKEN_EXPIRED_CODE) {
                res.status(401).json({ message: config.RES_MESSAGES.ERROR.TOKEN_EXPIRED });
            } else {
                res.status(400).json({ message: config.RES_MESSAGES.ERROR.TOKEN_INVALID });
            }
        }
    } else {
        res.status(401).json({ message: config.RES_MESSAGES.ERROR.TOKEN_NOT_PROVIDED });
    }
};

const createToken = (user) => {
    return jwt.sign({ user }, jwtSecret, { expiresIn: config.TOKEN.TOKEN_EXPIRED_TIME });
};

module.exports = {
    createToken,
    verifyToken,
};