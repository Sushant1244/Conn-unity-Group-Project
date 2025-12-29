import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList';
import PollSection from './components/PollSection';
import MoodTags from './components/MoodTags';
import './App.css';

// Axios will use proxy from vite.config.js for /api routes

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
    fetchPosts();
    fetchCommunities();
    fetchPolls();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await axios.get('/api/communities');
      setCommunities(res.data.communities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      const res = await axios.get('/api/polls');
      setPolls(res.data.polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const handleVote = async (postId, type) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    try {
      const res = await axios.post(`/api/votes/post/${postId}`, { type });
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, upvoteCount: res.data.upvoteCount, userUpvoted: res.data.userUpvoted, userDownvoted: res.data.userDownvoted }
          : post
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSavePost = async (postId) => {
    if (!user) {
      alert('Please login to save posts');
      return;
    }
    try {
      await axios.post(`/api/votes/save/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="app">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <div className="app-container">
        <div className="main-content">
          <MoodTags />
          {polls.length > 0 && <PollSection polls={polls} user={user} />}
          <PostList 
            posts={posts} 
            loading={loading}
            onVote={handleVote}
            onSave={handleSavePost}
            user={user}
          />
        </div>
        <Sidebar 
          user={user} 
          communities={communities}
          onJoinCommunity={fetchCommunities}
          onRefreshPosts={fetchPosts}
        />
      </div>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-logo">Conn-unity</span>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Term</a>
          </div>
          <span className="footer-copyright">Connunity Inc © 2025. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

