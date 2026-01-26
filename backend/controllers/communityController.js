const db = require('../services/db.service');

// Create new community
exports.createCommunity = async (req, res) => {
  try {
    const { name, displayName, description, topics, imageUrl } = req.body || {};
    const userId = req.user?.id; // From auth middleware

    if (!name || !displayName) {
      return res.status(400).json({ success: false, message: 'Name and display name are required' });
    }

    // Check if community already exists
    const existing = await db.getCommunityByName(name);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Community name already taken' });
    }

    const community = await db.createCommunity(
      name,
      displayName,
      description,
      topics || [],
      imageUrl,
      userId
    );

    // Auto-join creator to the community
    if (userId) {
      await db.joinCommunity(userId, community.id);
    }

    return res.status(201).json({ success: true, community });
  } catch (error) {
    console.error('Create community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all communities
exports.getAllCommunities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const communities = await db.getAllCommunities(limit, offset);

    return res.json({ success: true, communities });
  } catch (error) {
    console.error('Get communities error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get community by ID
exports.getCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await db.getCommunityById(parseInt(id));

    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    return res.json({ success: true, community });
  } catch (error) {
    console.error('Get community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update community
exports.updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body || {};

    const community = await db.getCommunityById(parseInt(id));
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    // Check if user is creator
    if (community.creator_id !== userId) {
      return res.status(403).json({ success: false, message: 'Only community creator can update' });
    }

    const updated = await db.updateCommunity(parseInt(id), updates);

    return res.json({ success: true, community: updated });
  } catch (error) {
    console.error('Update community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete community
exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const community = await db.getCommunityById(parseInt(id));
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    // Check if user is creator
    if (community.creator_id !== userId) {
      return res.status(403).json({ success: false, message: 'Only community creator can delete' });
    }

    await db.deleteCommunity(parseInt(id));

    return res.json({ success: true, message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Delete community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Join community
exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const community = await db.getCommunityById(parseInt(id));
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    const membership = await db.joinCommunity(userId, parseInt(id));

    if (!membership) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    return res.json({ success: true, message: 'Joined community successfully' });
  } catch (error) {
    console.error('Join community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Leave community
exports.leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await db.leaveCommunity(userId, parseInt(id));

    return res.json({ success: true, message: 'Left community successfully' });
  } catch (error) {
    console.error('Leave community error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
