const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { adminLogin, adminDashboard } = require('../controllers/adminController')

router.post('/admin-login', ah(adminLogin))
router.get('/admin/dashboard', ah(adminDashboard))

module.exports = router
