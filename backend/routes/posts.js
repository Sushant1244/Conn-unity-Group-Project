const express = require('express');
const router = express.Router();
const ah = require('../helpers/asyncHandler');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost,
    votePost,
    savePost
} = require('../controllers/postController');

router.get('/posts', ah(getPosts));
// Accept multipart form with optional field name 'media'
router.post('/posts', authMiddleware, upload.single('media'), ah(createPost));
router.get('/posts/:id', ah(getPost));
router.put('/posts/:id', authMiddleware, ah(updatePost));
router.delete('/posts/:id', authMiddleware, ah(deletePost));
router.post('/posts/:id/vote', authMiddleware, ah(votePost));
router.post('/posts/:id/save', authMiddleware, ah(savePost));

module.exports = router;
