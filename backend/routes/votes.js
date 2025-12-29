import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Vote on post
router.post('/post/:postId', authenticate, async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.some(id => id.toString() === userId.toString());
    const hasDownvoted = post.downvotes.some(id => id.toString() === userId.toString());

    if (type === 'upvote') {
      if (hasUpvoted) {
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
      } else {
        post.upvotes.push(userId);
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
      }
    } else if (type === 'downvote') {
      if (hasDownvoted) {
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
      } else {
        post.downvotes.push(userId);
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
      }
    }

    post.upvoteCount = post.upvotes.length - post.downvotes.length;
    await post.save();

    res.json({ 
      upvoteCount: post.upvoteCount,
      userUpvoted: post.upvotes.some(id => id.toString() === userId.toString()),
      userDownvoted: post.downvotes.some(id => id.toString() === userId.toString())
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vote on comment
router.post('/comment/:commentId', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = comment.upvotes.some(id => id.toString() === userId.toString());

    if (hasUpvoted) {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      comment.upvotes.push(userId);
    }

    comment.upvoteCount = comment.upvotes.length;
    await comment.save();

    res.json({ 
      upvoteCount: comment.upvoteCount,
      userUpvoted: comment.upvotes.some(id => id.toString() === userId.toString())
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save post
router.post('/save/:postId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;

    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.json({ saved: user.savedPosts.includes(postId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

