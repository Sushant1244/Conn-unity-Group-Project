const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { getDashboard } = require('../controllers/dashboardController')

router.get('/dashboard', ah(getDashboard))

module.exports = router
