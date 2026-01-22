import React, { useState, useRef } from 'react'
import './Profile.css'
import { useNotification, NotificationContainer } from './Notification'

export default function Profile({ user, onUpdateUser }) {
  const { 
    notifications, 
    removeNotification, 
    showSuccess, 
    showError 
  } = useNotification()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    website: user?.website || '',
    birthday: user?.birthday || '',
    gender: user?.gender || '',
    language: user?.language || 'English',
    timezone: user?.timezone || 'UTC',
    profilePic: user?.profilePic || '',
    coverPhoto: user?.coverPhoto || ''
  })
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '')
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(user?.coverPhoto || '')
  
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setFormData(prev => ({ ...prev, profilePic: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result)
        setFormData(prev => ({ ...prev, coverPhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Validation
    if (!formData.username.trim()) {
      showError('Username is required')
      return
    }
    if (!formData.email.includes('@')) {
      showError('Valid email is required')
      return
    }

    // Update user in localStorage
    const updatedUser = {
      ...user,
      ...formData,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem('connunity_current_user', JSON.stringify(updatedUser))

    // Update in users list
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('connunity_users', JSON.stringify(users))
    }

    if (onUpdateUser) {
      onUpdateUser(updatedUser)
    }

    setIsEditing(false)
    showSuccess('Profile updated successfully!')
  }

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      company: user?.company || '',
      website: user?.website || '',
      birthday: user?.birthday || '',
      gender: user?.gender || '',
      language: user?.language || 'English',
      timezone: user?.timezone || 'UTC',
      profilePic: user?.profilePic || '',
      coverPhoto: user?.coverPhoto || ''
    })
    setPreviewUrl(user?.profilePic || '')
    setCoverPreviewUrl(user?.coverPhoto || '')
    setIsEditing(false)
  }

  return (
    <div className="profile-page">
      {/* Cover Photo */}
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
        {isEditing && (
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
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverPhotoChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-pic-large">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-placeholder-large">
                <span className="placeholder-letter">{formData.username?.[0]?.toUpperCase() || '👤'}</span>
              </div>
            )}
            {isEditing && (
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
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="profile-info">
            <h1>{formData.username || 'User'}</h1>
            <p className="profile-email">{formData.email || 'email@example.com'}</p>
            {formData.bio && <p className="profile-bio">{formData.bio}</p>}
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Details Sections */}
        <div className="profile-sections">
          {/* Personal Information */}
          <section className="profile-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 20c0-4 3-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Personal Information
            </h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="detail-value">{formData.username || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="your@email.com"
                  />
                ) : (
                  <div className="detail-value">{formData.email || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <div className="detail-value">{formData.phone || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Birthday</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="detail-input"
                  />
                ) : (
                  <div className="detail-value">{formData.birthday || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="detail-input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="detail-value">{formData.gender || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item full-width">
                <label className="detail-label">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="detail-textarea"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                ) : (
                  <div className="detail-value">{formData.bio || 'Not provided'}</div>
                )}
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="profile-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Professional Details
            </h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="Company name"
                  />
                ) : (
                  <div className="detail-value">{formData.company || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="detail-value">{formData.location || 'Not provided'}</div>
                )}
              </div>

              <div className="detail-item full-width">
                <label className="detail-label">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="detail-input"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <div className="detail-value">
                    {formData.website ? (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        {formData.website}
                      </a>
                    ) : 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="profile-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Preferences
            </h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Language</label>
                {isEditing ? (
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="detail-input"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                ) : (
                  <div className="detail-value">{formData.language || 'English'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">Timezone</label>
                {isEditing ? (
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="detail-input"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST (Eastern)</option>
                    <option value="CST">CST (Central)</option>
                    <option value="MST">MST (Mountain)</option>
                    <option value="PST">PST (Pacific)</option>
                    <option value="GMT">GMT</option>
                    <option value="IST">IST (India)</option>
                  </select>
                ) : (
                  <div className="detail-value">{formData.timezone || 'UTC'}</div>
                )}
              </div>
            </div>
          </section>

          {/* Account Information */}
          <section className="profile-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Account Information
            </h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">User ID</label>
                <div className="detail-value">{user?.id || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Account Created</label>
                <div className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Last Updated</label>
                <div className="detail-value">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                </div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Account Status</label>
                <div className="detail-value">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}
