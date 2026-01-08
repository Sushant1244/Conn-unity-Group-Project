import React, { useState } from 'react'
import './ForgotPassword.css'

export default function ForgotPassword({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!open) return null

  function handleSubmit() {
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      return setError('Email is required')
    }
    
    if (!email.includes('@')) {
      return setError('Please enter a valid email address')
    }

    // Check if user exists in localStorage
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    const userExists = users.some(user => user.email === email)

    if (!userExists) {
      return setError('No account found with this email address')
    }

    // Simulate sending reset email
    // In production, this would call a backend API
    console.log('Password reset email sent to:', email)
    setSuccess(true)
    
    // Auto-close after 3 seconds on success
    setTimeout(() => {
      onClose && onClose()
      setEmail('')
      setSuccess(false)
    }, 3000)
  }

  function handleClose() {
    setEmail('')
    setError('')
    setSuccess(false)
    onClose && onClose()
  }

  return (
    <div className="forgot-password-root">
      <div className="forgot-password-container">
        <div className="forgot-password-icon-wrapper">
          <div className="forgot-password-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="10" rx="2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="16" r="1" fill="#fff"/>
            </svg>
          </div>
        </div>
        
        <h2 className="forgot-password-title">Reset Password</h2>
        <div className="forgot-password-subtitle">
          {success 
            ? 'Check your email for reset instructions' 
            : 'Enter your email to receive a password reset link'}
        </div>

        <div className="forgot-password-card">
          {!success ? (
            <>
              <div className="card-title">Forgot Password?</div>
              <div className="card-subtitle">We'll send you a reset link</div>

              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8l9 6 9-6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input 
                  type="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="btn-container">
                <button className="reset-btn" onClick={handleSubmit} type="button">
                  Send Reset Link
                </button>
                <button className="cancel-btn" onClick={handleClose} type="button">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="success-container">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5"/>
                  <path d="M8 12l2.5 2.5L16 9" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="success-title">Email Sent!</div>
              <div className="success-message">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </div>
            </div>
          )}
        </div>

        <div className="back-to-login">
          Remember your password? <button onClick={handleClose} className="link-btn">Back to Login</button>
        </div>
      </div>
    </div>
  )
}
