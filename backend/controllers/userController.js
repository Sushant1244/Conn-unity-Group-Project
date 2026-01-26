const db = require('../services/db.service');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(parseInt(id));

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body || {};

    // Check if user can update this profile
    if (parseInt(id) !== userId) {
      return res.status(403).json({ success: false, message: 'Cannot update another user\'s profile' });
    }

    const updated = await db.updateUser(parseInt(id), updates);

    return res.json({ success: true, user: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await db.getPosts({ authorId: parseInt(id) }, limit, offset);

    return res.json({ success: true, posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's saved posts
exports.getSavedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Only allow users to see their own saved posts
    if (parseInt(id) !== userId) {
      return res.status(403).json({ success: false, message: 'Cannot view another user\'s saved posts' });
    }

    const posts = await db.getSavedPosts(parseInt(id), limit, offset);

    return res.json({ success: true, posts });
  } catch (error) {
    console.error('Get saved posts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's communities
exports.getUserCommunities = async (req, res) => {
  try {
    const { id } = req.params;
    const communities = await db.getUserCommunities(parseInt(id));

    return res.json({ success: true, communities });
  } catch (error) {
    console.error('Get user communities error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 50;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const notifications = await db.getUserNotifications(userId, limit);

    return res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.markNotificationAsRead(parseInt(id));

    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark all notifications as read
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await db.markAllNotificationsAsRead(userId);

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Clear all notifications
exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await db.clearAllNotifications(userId);

    return res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
