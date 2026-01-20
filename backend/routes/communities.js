const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { getCommunities, createCommunity } = require('../controllers/communityController')

router.get('/communities', ah(getCommunities))
router.post('/communities', ah(createCommunity))

module.exports = router
