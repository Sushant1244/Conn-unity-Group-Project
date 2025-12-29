import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Community from './models/Community.js';
import Post from './models/Post.js';
import Poll from './models/Poll.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connunity');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Poll.deleteMany({});

    // Create users
    const user1 = new User({
      username: 'techEnthusiast42',
      email: 'tech@example.com',
      password: 'password123'
    });
    await user1.save();

    const user2 = new User({
      username: 'PixelWarrior',
      email: 'pixel@example.com',
      password: 'password123'
    });
    await user2.save();

    const user3 = new User({
      username: 'Developer',
      email: 'dev@example.com',
      password: 'password123'
    });
    await user3.save();

    // Create communities
    const techCommunity = new Community({
      name: 'technology',
      displayName: 'Technology',
      description: 'Discuss the latest in tech',
      icon: 'T',
      createdBy: user1._id,
      members: [user1._id, user2._id, user3._id],
      memberCount: 3
    });
    await techCommunity.save();

    const gamingCommunity = new Community({
      name: 'gaming',
      displayName: 'Gaming',
      description: 'All things gaming',
      icon: 'G',
      createdBy: user2._id,
      members: [user1._id, user2._id],
      memberCount: 2
    });
    await gamingCommunity.save();

    const natureCommunity = new Community({
      name: 'nature',
      displayName: 'Nature',
      description: 'Beautiful nature content',
      icon: 'N',
      createdBy: user3._id,
      members: [user3._id],
      memberCount: 1
    });
    await natureCommunity.save();

    const cookingCommunity = new Community({
      name: 'cooking',
      displayName: 'Cooking',
      description: 'Share recipes and cooking tips',
      icon: 'C',
      createdBy: user1._id,
      members: [user1._id],
      memberCount: 1
    });
    await cookingCommunity.save();

    const programmingCommunity = new Community({
      name: 'programming',
      displayName: 'Programming',
      description: 'Code discussions and help',
      icon: 'P',
      createdBy: user2._id,
      members: [user2._id],
      memberCount: 1
    });
    await programmingCommunity.save();

    // Update member counts
    techCommunity.memberCount = techCommunity.members.length;
    gamingCommunity.memberCount = gamingCommunity.members.length;
    await techCommunity.save();
    await gamingCommunity.save();

    // Create posts
    const post1 = new Post({
      title: 'The Future of AI in Software Development: What We Can Expect in 2026',
      content: 'AI is revolutionizing how we write code and build software. From intelligent code completion to automated testing, the tools available to developers are becoming more powerful every day.',
      community: techCommunity._id,
      author: user1._id,
      type: 'Discussion',
      mood: 'Educational',
      upvotes: [user2._id, user3._id],
      upvoteCount: 2,
      commentCount: 0
    });
    await post1.save();

    const post2 = new Post({
      title: 'Just finished this indie game and WOW - hidden gem alert!',
      content: 'The storytelling, gameplay mechanics, and art style are absolutely incredible. Highly recommend checking it out this weekend!',
      community: gamingCommunity._id,
      author: user2._id,
      type: 'Discussion',
      mood: 'Funny',
      upvotes: [user1._id],
      upvoteCount: 1,
      commentCount: 0
    });
    await post2.save();

    // Create poll
    const poll1 = new Poll({
      question: 'What feature should we build next?',
      options: [
        { text: 'Dark Mode', votes: [], voteCount: 0 },
        { text: 'Mobile App', votes: [], voteCount: 0 },
        { text: 'AI Assistant', votes: [], voteCount: 0 },
        { text: 'Advance Search', votes: [], voteCount: 0 }
      ],
      community: techCommunity._id,
      createdBy: user1._id,
      voters: [],
      totalVotes: 0
    });
    await poll1.save();

    console.log('Seed data created successfully!');
    console.log('Users created:', await User.countDocuments());
    console.log('Communities created:', await Community.countDocuments());
    console.log('Posts created:', await Post.countDocuments());
    console.log('Polls created:', await Poll.countDocuments());
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

