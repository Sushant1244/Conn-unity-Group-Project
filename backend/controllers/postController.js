const db = require('../services/db.service');

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { communityId, title, body, category, tag, mood, mediaUrl, mediaType } = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!title || !body || !communityId) {
      return res.status(400).json({ success: false, message: 'Title, body, and community are required' });
    }

    const post = await db.createPost(
      parseInt(communityId),
      userId,
      title,
      body,
      category,
      tag,
      mood,
      mediaUrl,
      mediaType
    );

    return res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all posts with optional filters
exports.getPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const filters = {};
    if (req.query.communityId) filters.communityId = parseInt(req.query.communityId);
    if (req.query.authorId) filters.authorId = parseInt(req.query.authorId);
    if (req.query.search) filters.search = req.query.search;

    const posts = await db.getPosts(filters, limit, offset);

    return res.json({ success: true, posts });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single post by ID
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.getPostById(parseInt(id));

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Also get comments
    const comments = await db.getPostComments(parseInt(id));
    post.comments = comments;

    return res.json({ success: true, post });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body || {};

    const post = await db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is author
    if (post.author_id !== userId) {
      return res.status(403).json({ success: false, message: 'Only post author can update' });
    }

    const updated = await db.updatePost(parseInt(id), updates);

    return res.json({ success: true, post: updated });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const post = await db.getPostById(parseInt(id));
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is author
    if (post.author_id !== userId) {
      return res.status(403).json({ success: false, message: 'Only post author can delete' });
    }

    await db.deletePost(parseInt(id));

    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Vote on post
exports.votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body || {}; // 1 for upvote, -1 for downvote
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (voteType !== 1 && voteType !== -1) {
      return res.status(400).json({ success: false, message: 'Vote type must be 1 or -1' });
    }

    // Check if user already voted
    const existing = await db.getUserVote(userId, parseInt(id), null);

    if (existing && existing.vote_type === voteType) {
      // Remove vote if clicking same button
      await db.removePostVote(userId, parseInt(id));
      return res.json({ success: true, message: 'Vote removed', action: 'removed' });
    }

    // Add or update vote
    await db.votePost(userId, parseInt(id), voteType);

    return res.json({ success: true, message: 'Vote recorded', voteType });
  } catch (error) {
    console.error('Vote post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Save/unsave post
exports.savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const isSaved = await db.isPostSaved(userId, parseInt(id));

    if (isSaved) {
      await db.unsavePost(userId, parseInt(id));
      return res.json({ success: true, message: 'Post unsaved', saved: false });
    } else {
      await db.savePost(userId, parseInt(id));
      return res.json({ success: true, message: 'Post saved', saved: true });
    }
  } catch (error) {
    console.error('Save post error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
