const express = require('express')
const auth = require('../middlewares/authentication')
const user = require('../controllers/user-controller')

const router = express.Router()

router.get('/verify-token', auth.verifyToken, user.verify)
// router.get('/', user.getCategory)
router.post('/login', user.login)
router.post('/register', user.register)
// router.put('/:category_id', user.updateCategory)
// router.delete('/:category_id', user.deleteCategory)

module.exports = router