import express from 'express';
import Poll from '../models/Poll.js';
import Community from '../models/Community.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get polls
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { community } = req.query;
    let query = {};
    
    if (community) {
      const comm = await Community.findOne({ name: community });
      if (comm) {
        query.community = comm._id;
      }
    }

    const polls = await Poll.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username avatar')
      .populate('community', 'name displayName icon')
      .limit(10);

    const pollsWithUserData = polls.map(poll => {
      const pollObj = poll.toObject();
      if (req.user) {
        pollObj.userVoted = poll.voters.some(
          id => id.toString() === req.user._id.toString()
        );
        pollObj.userVoteOption = poll.options.find(opt => 
          opt.votes.some(id => id.toString() === req.user._id.toString())
        )?.text || null;
      }
      return pollObj;
    });

    res.json({ polls: pollsWithUserData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create poll
router.post('/', authenticate, async (req, res) => {
  try {
    const { question, options, community } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2 || !community) {
      return res.status(400).json({ message: 'Question, at least 2 options, and community are required' });
    }

    const comm = await Community.findOne({ name: community });
    if (!comm) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt, votes: [], voteCount: 0 })),
      community: comm._id,
      createdBy: req.user._id
    });

    await poll.save();
    await poll.populate('createdBy', 'username avatar');
    await poll.populate('community', 'name displayName icon');

    res.status(201).json({ poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vote on poll
router.post('/:id/vote', authenticate, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const userId = req.user._id;
    const hasVoted = poll.voters.some(id => id.toString() === userId.toString());

    if (hasVoted) {
      // Remove previous vote
      poll.options.forEach(opt => {
        opt.votes = opt.votes.filter(id => id.toString() !== userId.toString());
        opt.voteCount = opt.votes.length;
      });
      poll.voters = poll.voters.filter(id => id.toString() !== userId.toString());
      poll.totalVotes = poll.voters.length;
    }

    if (optionIndex >= 0 && optionIndex < poll.options.length) {
      poll.options[optionIndex].votes.push(userId);
      poll.options[optionIndex].voteCount = poll.options[optionIndex].votes.length;
      poll.voters.push(userId);
      poll.totalVotes = poll.voters.length;
    }

    await poll.save();

    res.json({ poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

