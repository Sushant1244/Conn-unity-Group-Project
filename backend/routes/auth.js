const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const {
    register,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    checkAuth
} = require('../controllers/authController')
const { authMiddleware } = require('../middleware/auth')

router.post('/register', ah(register))
router.post('/verify-otp', ah(verifyOTP))
router.post('/resend-otp', ah(resendOTP))
router.post('/login', ah(login))
router.post('/forgot-password', ah(forgotPassword))
router.post('/reset-password', ah(resetPassword))
router.get('/check-auth', authMiddleware, ah(checkAuth))

module.exports = router
