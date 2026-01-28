import { useState, useEffect } from 'react';
import './SavePost.css';

const SavePost = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'oldest'

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      
      const mockSavedPosts = [
        {
          id: 1,
          title: 'How to Build a React App',
          content: 'In this post, we will explore the fundamentals of building a React application from scratch...',
          author: 'John Doe',
          savedAt: '2026-01-20T10:30:00',
          category: 'Tutorial',
          likes: 245,
          image: null
        },
        {
          id: 2,
          title: 'Top 10 JavaScript Tips',
          content: 'Discover these amazing JavaScript tips that will improve your coding efficiency...',
          author: 'Jane Smith',
          savedAt: '2026-01-19T15:45:00',
          category: 'Tips',
          likes: 189,
          image: null
        },
        {
          id: 3,
          title: 'Understanding CSS Grid',
          content: 'CSS Grid is a powerful layout system that makes it easy to create complex responsive designs...',
          author: 'Bob Wilson',
          savedAt: '2026-01-18T09:20:00',
          category: 'CSS',
          likes: 312,
          image: null
        },
        {
          id: 4,
          title: 'Node.js Best Practices',
          content: 'Learn the best practices for building scalable Node.js applications...',
          author: 'Alice Brown',
          savedAt: '2026-01-17T14:10:00',
          category: 'Backend',
          likes: 428,
          image: null
        }
      ];
      
      setSavedPosts(mockSavedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePost = async (postId) => {
    try {
     
      
      setSavedPosts(savedPosts.filter(post => post.id !== postId));
      alert('Post removed from saved items');
    } catch (error) {
      console.error('Error unsaving post:', error);
      alert('Failed to remove post');
    }
  };

  const handleViewPost = (postId) => {
   
    console.log('Viewing post:', postId);
    
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  
  const filteredPosts = savedPosts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.savedAt) - new Date(a.savedAt);
      } else {
        return new Date(a.savedAt) - new Date(b.savedAt);
      }
    });

  if (loading) {
    return <div className="save-post-container loading">Loading saved posts...</div>;
  }

  return (
    <div className="save-post-container">
      <div className="save-post-header">
        <h1>Saved Posts</h1>
        <p className="saved-count">{savedPosts.length} saved {savedPosts.length === 1 ? 'post' : 'posts'}</p>
      </div>

      <div className="save-post-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search saved posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="saved-posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-saved-posts">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3>No saved posts found</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Start saving posts to see them here'}</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-category">{post.category}</span>
                <button 
                  className="unsave-btn"
                  onClick={() => handleUnsavePost(post.id)}
                  title="Remove from saved"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>

              <h2 className="post-title">{post.title}</h2>
              
              <p className="post-content">
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? '...' : ''}
              </p>

              <div className="post-meta">
                <span className="post-author">By {post.author}</span>
                <span className="post-likes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {post.likes}
                </span>
              </div>

              <div className="post-footer">
                <span className="saved-date">Saved {formatDate(post.savedAt)}</span>
                <button 
                  className="view-btn"
                  onClick={() => handleViewPost(post.id)}
                >
                  View Post
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavePost;
