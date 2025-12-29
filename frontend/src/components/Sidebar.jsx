import React, { useState } from 'react';
import { FiAward, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import './Sidebar.css';
import CreatePostModal from './CreatePostModal';

function Sidebar({ user, communities, onJoinCommunity, onRefreshPosts }) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [challenges] = useState([
    { name: 'Community Contributor', difficulty: 'Easy', progress: 0, total: 10 },
    { name: 'Conversation Starter', difficulty: 'Medium', progress: 0, total: 5 },
    { name: 'Post 5 Comment', difficulty: 'Medium', progress: 0, total: 5 }
  ]);

  const handleJoinCommunity = async (communityName) => {
    if (!user) {
      alert('Please login to join communities');
      return;
    }

    try {
      await axios.post(`/api/communities/${communityName}/join`);
      onJoinCommunity();
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleCreateCommunity = async () => {
    if (!user) {
      alert('Please login to create a community');
      return;
    }

    const name = prompt('Enter community name (no spaces, lowercase)');
    if (!name) return;
    const displayName = prompt('Enter display name for the community');
    if (!displayName) return;

    try {
      const res = await axios.post('/api/communities', { name, displayName });
      alert('Community created: ' + res.data.community.name);
      // refresh communities list
      onJoinCommunity();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create community');
    }
  };

  return (
    <>
    <div className="sidebar">
      {user && (
        <div className="user-profile-section">
          <div className="user-avatar-large">
            {user.avatar || user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-name">{user.username}</div>
        </div>
      )}

      <div className="sidebar-section">
        <div className="sidebar-banner">
          <div className="banner-content">
            <h4>Your personal Community frontpage</h4>
            <p>Come here to check in with your favorite communities.</p>
            <div className="banner-buttons">
              <button className="create-post-btn" onClick={() => setShowCreatePost(true)}>Create Post</button>
              <button className="create-community-btn" onClick={handleCreateCommunity}>Create Community</button>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Popularity Community</h3>
        <div className="community-list">
          {communities.slice(0, 5).map((community, index) => (
            <div key={community._id} className="community-item">
              <div className="community-rank">{index + 1}</div>
              <div className="community-icon-small" style={{ backgroundColor: '#3B82F6' }}>
                {community.name.charAt(2)?.toUpperCase() || 'C'}
              </div>
              <div className="community-info-small">
                <span className="community-name-small">c/{community.name}</span>
                <span className="community-members">
                  {community.memberCount >= 1000000
                    ? (community.memberCount / 1000000).toFixed(1) + 'M'
                    : community.memberCount >= 1000
                    ? (community.memberCount / 1000).toFixed(1) + 'K'
                    : community.memberCount}{' '}
                  members
                </span>
              </div>
              <button
                className="join-button"
                onClick={() => handleJoinCommunity(community.name)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
        <a href="#" className="view-all-link">View All Community</a>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title-with-icon">
          <FiAward className="title-icon" />
          <h3 className="sidebar-title">Daily Challenges</h3>
        </div>
        <div className="challenges-list">
          {challenges.map((challenge, index) => (
            <div key={index} className="challenge-item">
              <div className="challenge-header">
                <span className="challenge-name">{challenge.name}</span>
                <span className={`challenge-difficulty ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="challenge-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(challenge.progress / challenge.total) * 100}%`
                    }}
                  />
                </div>
                <span className="progress-text">
                  {challenge.progress}/{challenge.total}
                </span>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="view-all-link">View All Challenges</a>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title-with-icon">
          <FiInfo className="title-icon" />
          <h3 className="sidebar-title">About Community</h3>
        </div>
        <div className="about-content">
          <p>
            Welcome to Connunity! Share your thoughts, discover new communities,
            and engage with people who share your interests.
          </p>
          <div className="about-meta">
            <p>Created Jan 1, 2025</p>
            <div className="about-stats">
              <span>Members: 2.5M</span>
              <span>Online: 42.8K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showCreatePost && (
      <CreatePostModal
        show={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        communities={communities}
        onPostCreated={() => { setShowCreatePost(false); if (onRefreshPosts) onRefreshPosts(); }}
      />
    )}
    </>
  );
}

export default Sidebar;

