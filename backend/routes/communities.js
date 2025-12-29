import express from 'express';
import Community from '../models/Community.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all communities (popular)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const communities = await Community.find()
      .sort({ memberCount: -1 })
      .limit(10)
      .select('name displayName icon memberCount onlineCount');

    res.json({ communities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single community
router.get('/:name', optionalAuth, async (req, res) => {
  try {
    const community = await Community.findOne({ name: req.params.name })
      .populate('createdBy', 'username')
      .populate('members', 'username avatar');

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.json({ community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create community
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, displayName, description, icon } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({ message: 'Name and display name are required' });
    }

    const existingCommunity = await Community.findOne({ name: name.toLowerCase() });
    if (existingCommunity) {
      return res.status(400).json({ message: 'Community already exists' });
    }

    const community = new Community({
      name: name.toLowerCase(),
      displayName,
      description: description || '',
      icon: icon || '',
      createdBy: req.user._id,
      members: [req.user._id],
      memberCount: 1
    });

    await community.save();
    res.status(201).json({ community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join community
router.post('/:name/join', authenticate, async (req, res) => {
  try {
    const community = await Community.findOne({ name: req.params.name });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      community.memberCount = community.members.length;
      await community.save();
    }

    res.json({ message: 'Joined community', community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave community
router.post('/:name/leave', authenticate, async (req, res) => {
  try {
    const community = await Community.findOne({ name: req.params.name });
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    community.members = community.members.filter(
      member => member.toString() !== req.user._id.toString()
    );
    community.memberCount = community.members.length;
    await community.save();

    res.json({ message: 'Left community', community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

