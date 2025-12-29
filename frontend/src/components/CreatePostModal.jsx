import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePostModal.css';

export default function CreatePostModal({ show, onClose, communities = [], onPostCreated, defaultCommunity }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState(defaultCommunity || (communities[0] && communities[0].name) || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCommunity(defaultCommunity || (communities[0] && communities[0].name) || '');
  }, [defaultCommunity, communities]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setImageFile(f || null);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!title.trim() || !content.trim() || !community) {
      setErrorMsg('Title, content and community are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('You must be logged in to create a post.');
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (imageFile) {
        const form = new FormData();
        form.append('title', title);
        form.append('content', content);
        form.append('community', community);
        form.append('image', imageFile);
        res = await axios.post('/api/posts', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('/api/posts', { title, content, community });
      }

      if (res && (res.status === 201 || res.status === 200)) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setPreviewUrl(null);
        onClose();
        if (onPostCreated) onPostCreated(res.data.post || res.data);
      } else {
        setErrorMsg(res?.data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="create-post-modal-backdrop">
      <div className="create-post-modal">
        <div className="modal-header">
          <h3>Create Post</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {errorMsg && <div className="error-box">{errorMsg}</div>}

          <label className="input-label">Community</label>
          <select value={community} onChange={e => setCommunity(e.target.value)}>
            <option value="">Select community</option>
            {communities.map(c => (
              <option key={c._id} value={c.name}>c/{c.name}</option>
            ))}
          </select>

          <label className="input-label">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />

          <label className="input-label">Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write something..." />

          <label className="input-label">Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="preview" />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn primary" onClick={handleSubmit} disabled={submitting}> {submitting ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
    </div>
  );
}
