const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { getProfile, updateProfile, getUserById } = require('../controllers/userController')

router.get('/profile', ah(getProfile))
router.put('/profile', ah(updateProfile))
router.get('/users/:id', ah(getUserById))

module.exports = router
