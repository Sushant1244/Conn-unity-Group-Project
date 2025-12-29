import express from 'express';
import Post from '../models/Post.js';
import Community from '../models/Community.js';
import Comment from '../models/Comment.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// try to load multer (should be in dependencies). If present we'll use it for image uploads.
let upload = null;
try {
  // dynamic require so tests that don't have multer won't break
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const multer = await import('multer');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, `${unique}.${ext}`);
    }
  });
  upload = multer({ storage });
} catch (e) {
  // multer not available - we'll accept JSON-only posts
  upload = null;
}

// Get all posts (feed)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { community, sort = 'new' } = req.query;
    let query = {};
    
    if (community) {
      const comm = await Community.findOne({ name: community });
      if (comm) {
        query.community = comm._id;
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'hot') {
      sortOption = { upvoteCount: -1 };
    }

    const posts = await Post.find(query)
      .sort(sortOption)
      .populate('author', 'username avatar')
      .populate('community', 'name displayName icon')
      .limit(50);

    // Check if user has voted/saved
    const postsWithUserData = posts.map(post => {
      const postObj = post.toObject();
      if (req.user) {
        postObj.userUpvoted = post.upvotes.some(
          id => id.toString() === req.user._id.toString()
        );
        postObj.userDownvoted = post.downvotes.some(
          id => id.toString() === req.user._id.toString()
        );
      }
      return postObj;
    });

    res.json({ posts: postsWithUserData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('community', 'name displayName icon');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postObj = post.toObject();
    if (req.user) {
      postObj.userUpvoted = post.upvotes.some(
        id => id.toString() === req.user._id.toString()
      );
      postObj.userDownvoted = post.downvotes.some(
        id => id.toString() === req.user._id.toString()
      );
    }

    res.json({ post: postObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', authenticate, upload ? upload.single('image') : (req, res, next) => next(), async (req, res) => {
  try {
    // If multer is used, file will be available at req.file and other fields in req.body
    const { title, content, image, community, type, mood } = req.body;
    let imagePath = image || '';
    if (req.file && req.file.filename) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (!title || !content || !community) {
      return res.status(400).json({ message: 'Title, content, and community are required' });
    }

    const comm = await Community.findOne({ name: community });
    if (!comm) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const post = new Post({
      title,
      content,
      image: imagePath,
      community: comm._id,
      author: req.user._id,
      type: type || 'Discussion',
      mood: mood || null
    });

    await post.save();
    await post.populate('author', 'username avatar');
    await post.populate('community', 'name displayName icon');

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    post.updatedAt = new Date();
    await post.save();

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

