const express = require('express')
const { DB_NAME } = require('../config')
const auth = require('../middlewares/authentication')
const user = require('../controllers/user-controller')
const userMongo = require('../controllers/mongoose/user-controller-mongo')

const router = express.Router()

router.get('/verify-token', auth.verifyToken, user.verify)
router.post('/login', DB_NAME == 'mongoDB' ? userMongo.login : user.login)
router.post('/register', DB_NAME == 'mongoDB' ? userMongo.register : user.login)
router.post('/google-login', DB_NAME == 'mongoDB' ? userMongo.googleLogin : (req, res) => { res.status(200) })
router.post('/facebook-login', DB_NAME == 'mongoDB' ? userMongo.facebookLogin : (req, res) => { res.status(200) })
// router.get('/', user.getCategory)
// router.put('/:category_id', user.updateCategory)
// router.delete('/:category_id', user.deleteCategory)

module.exports = router