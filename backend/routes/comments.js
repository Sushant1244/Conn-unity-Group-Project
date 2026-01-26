const express = require('express');
const router = express.Router();
const ah = require('../helpers/asyncHandler');
const { authMiddleware } = require('../middleware/auth');
const {
    createComment,
    getPostComments,
    deleteComment,
    voteComment
} = require('../controllers/commentController');

router.post('/posts/:postId/comments', authMiddleware, ah(createComment));
router.get('/posts/:postId/comments', ah(getPostComments));
router.delete('/comments/:id', authMiddleware, ah(deleteComment));
router.post('/comments/:id/vote', authMiddleware, ah(voteComment));

module.exports = router;
