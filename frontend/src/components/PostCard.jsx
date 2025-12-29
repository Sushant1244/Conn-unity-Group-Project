import React from 'react';
import { FiArrowUp, FiArrowDown, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';
import './PostCard.css';

function PostCard({ post, onVote, onSave, user }) {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="community-info">
          <div className="community-icon" style={{ backgroundColor: '#3B82F6' }}>
            {post.community?.name?.charAt(2)?.toUpperCase() || 'C'}
          </div>
          <span className="community-name">c/{post.community?.name || 'unknown'}</span>
        </div>
        <div className="post-meta">
          <span>Posted by u/{post.author?.username || 'unknown'}</span>
          <span className="post-time">{formatTime(post.createdAt)}</span>
          <span className="post-type">{post.type || 'Discussion'}</span>
        </div>
      </div>
      
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>
      
      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt={post.title} className="post-image" />
        </div>
      )}
      
      <div className="post-actions">
        <div className="vote-buttons">
          <button
            className={`vote-button upvote ${post.userUpvoted ? 'active' : ''}`}
            onClick={() => onVote(post._id, 'upvote')}
          >
            <FiArrowUp />
          </button>
          <span className="vote-count">{formatNumber(post.upvoteCount || 0)}</span>
          <button
            className={`vote-button downvote ${post.userDownvoted ? 'active' : ''}`}
            onClick={() => onVote(post._id, 'downvote')}
          >
            <FiArrowDown />
          </button>
        </div>
        
        <button className="action-button">
          <FiMessageCircle />
          <span>{formatNumber(post.commentCount || 0)}</span>
        </button>
        
        <button className="action-button">
          <FiShare2 />
          <span>Share</span>
        </button>
        
        <button
          className={`action-button ${post.saved ? 'saved' : ''}`}
          onClick={() => onSave(post._id)}
        >
          <FiBookmark />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;

