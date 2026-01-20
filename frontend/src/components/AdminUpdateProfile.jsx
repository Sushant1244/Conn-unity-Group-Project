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
  
  const [username, setUsername] = useState(currentUser.username || '')
  const [email, setEmail] = useState(currentUser.email || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [phone, setPhone] = useState(currentUser.phone || '')
  const [location, setLocation] = useState(currentUser.location || '')
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || '')
  const [previewUrl, setPreviewUrl] = useState(currentUser.profilePic || '')
  const [error, setError] = useState('')
  
  const fileInputRef = useRef(null)

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

    // Validation
    if (!username.trim()) {
      setError('Username is required')
      notify.showError('Username is required')
      return
    }

    if (!email.includes('@')) {
      setError('Valid email is required')
      notify.showError('Valid email is required')
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
      profilePic,
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
    
    // Close modal after delay if onClose is provided
    if (onClose) {
      setTimeout(() => onClose(), 1500)
    }
  }

  return (
    <div className="admin-update-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Update Profile</h2>
          <p>Manage your account information and profile picture</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Picture Section */}
          <div className="profile-pic-section">
            <label className="section-label">Profile Picture</label>
            <div className="profile-pic-wrapper">
              <div className="profile-pic-preview">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="profile-img" />
                ) : (
                  <div className="profile-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="profile-pic-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="profile-pic-input"
                />
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Photo
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                )}
                <span className="file-hint">JPG, PNG or GIF (Max 5MB)</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="form-textarea"
              rows="4"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            {onClose && (
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            )}
            <button type="submit" className="save-btn">
              Save Changes
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
