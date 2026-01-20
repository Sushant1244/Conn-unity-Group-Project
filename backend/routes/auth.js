const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { register, login } = require('../controllers/authController')

router.post('/register', ah(register))
router.post('/login', ah(login))

module.exports = router
