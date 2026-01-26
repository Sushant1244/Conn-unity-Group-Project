const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const {
    register,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword
} = require('../controllers/authController')

router.post('/register', ah(register))
router.post('/verify-otp', ah(verifyOTP))
router.post('/resend-otp', ah(resendOTP))
router.post('/login', ah(login))
router.post('/forgot-password', ah(forgotPassword))
router.post('/reset-password', ah(resetPassword))

module.exports = router
