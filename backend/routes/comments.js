import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', optionalAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .limit(100);

    const commentsWithUserData = comments.map(comment => {
      const commentObj = comment.toObject();
      if (req.user) {
        commentObj.userUpvoted = comment.upvotes.some(
          id => id.toString() === req.user._id.toString()
        );
      }
      return commentObj;
    });

    res.json({ comments: commentsWithUserData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ message: 'Content and post ID are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });

    await comment.save();
    post.commentCount = await Comment.countDocuments({ post: postId });
    await post.save();

    await comment.populate('author', 'username avatar');

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update comment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    const post = await Post.findById(comment.post);
    if (post) {
      post.commentCount = await Comment.countDocuments({ post: post._id });
      await post.save();
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

