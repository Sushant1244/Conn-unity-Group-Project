const express = require('express')
const router = express.Router()
const ah = require('../helpers/asyncHandler')
const { getPosts, createPost } = require('../controllers/postController')

router.get('/posts', ah(getPosts))
router.post('/posts', ah(createPost))

module.exports = router
