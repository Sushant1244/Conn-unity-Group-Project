import React, { useState, useRef } from 'react'
import { useNotification, NotificationContainer } from './Notification'
import './AdminUpdateProfile.css'

export default function AdminUpdateProfile({ onClose, showNotification: externalNotification }) {
  const { 
    notifications, 
    removeNotification, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useNotification()

  const notify = externalNotification || { showSuccess, showError, showWarning, showInfo }

  // Load current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('connunity_current_user') || '{}')
  
  const [activeTab, setActiveTab] = useState('profile')
  const [username, setUsername] = useState(currentUser.username || '')
  const [email, setEmail] = useState(currentUser.email || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [phone, setPhone] = useState(currentUser.phone || '')
  const [location, setLocation] = useState(currentUser.location || '')
  const [website, setWebsite] = useState(currentUser.website || '')
  const [company, setCompany] = useState(currentUser.company || '')
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || '')
  const [coverPhoto, setCoverPhoto] = useState(currentUser.coverPhoto || '')
  const [previewUrl, setPreviewUrl] = useState(currentUser.profilePic || '')
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(currentUser.coverPhoto || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        notify.showError('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        notify.showError('Please select an image file')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setProfilePic(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        notify.showError('Image size should be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        notify.showError('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result)
        setCoverPhoto(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePic('')
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    notify.showInfo('Profile photo removed')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validation
    if (!username.trim()) {
      setError('Username is required')
      notify.showError('Username is required')
      setIsSubmitting(false)
      return
    }

    if (!email.includes('@')) {
      setError('Valid email is required')
      notify.showError('Valid email is required')
      setIsSubmitting(false)
      return
    }

    // Update user data
    const updatedUser = {
      ...currentUser,
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      location: location.trim(),
      website: website.trim(),
      company: company.trim(),
      profilePic,
      coverPhoto,
      updatedAt: new Date().toISOString()
    }

    // Save to localStorage
    localStorage.setItem('connunity_current_user', JSON.stringify(updatedUser))

    // Update in users list
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('connunity_users', JSON.stringify(users))
    }

    notify.showSuccess('Profile updated successfully!')
    setIsSubmitting(false)
    
    // Close modal after delay if onClose is provided
    if (onClose) {
      setTimeout(() => onClose(), 1500)
    }
  }

  return (
    <div className="admin-update-profile">
      {/* Cover Photo Section */}
      <div className="profile-cover">
        {coverPreviewUrl ? (
          <img src={coverPreviewUrl} alt="Cover" className="cover-img" />
        ) : (
          <div className="cover-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#fff"/>
              <path d="M21 15l-5-5L5 21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <button 
          type="button" 
          className="cover-upload-btn"
          onClick={() => coverInputRef.current?.click()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Change Cover
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="profile-container">
        {/* Header with Profile Picture */}
        <div className="profile-header-section">
          <div className="profile-pic-large">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-placeholder-large">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#9ca3af" strokeWidth="1.5"/>
                </svg>
              </div>
            )}
            <button 
              type="button" 
              className="edit-avatar-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-header-info">
            <h1>{username || 'Your Name'}</h1>
            <p>{email || 'your@email.com'}</p>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="tab-icon">📧</span>
            Contact
          </button>
          <button 
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <span className="tab-icon">🔗</span>
            Social
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h3 className="tab-title">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Username</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Company</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏢</span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <span className="label-text">Bio</span>
                  <span className="char-count">{bio.length}/500</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  placeholder="Tell us about yourself..."
                  className="form-textarea"
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="tab-content">
              <h3 className="tab-title">Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Email</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Phone</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <span className="label-text">Location</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="tab-content">
              <h3 className="tab-title">Social Links</h3>
              <div className="form-group full-width">
                <label className="form-label">
                  <span className="label-text">Website</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🌐</span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="social-preview">
                <p className="preview-label">Profile Preview</p>
                <div className="mini-profile-card">
                  <div className="mini-avatar">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="mini-info">
                    <h4>{username || 'Your Name'}</h4>
                    <p>{bio || 'Your bio will appear here...'}</p>
                    {location && <span className="mini-location">📍 {location}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}
