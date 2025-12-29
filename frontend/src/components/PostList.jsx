import React from 'react';
import PostCard from './PostCard';
import './PostList.css';

function PostList({ posts, loading, onVote, onSave, user }) {
  if (loading) {
    return (
      <div className="post-list">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-list">
        <div className="no-posts">No posts yet. Be the first to post!</div>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onVote={onVote}
          onSave={onSave}
          user={user}
        />
      ))}
    </div>
  );
}

export default PostList;

