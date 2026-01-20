import React, { useState } from 'react'
import './Login.css'

export default function Login({ open, onSwitchToRegister, onAdminLogin, showNotification }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null;

  function submit(){
    setError('')
    if (!email.includes('@')) return setError('Valid email required')
    if (password.length < 8) return setError('Password must be 8+ chars')
    
    // Check if user exists
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    const user = users.find(u => u.email === email)
    
    if (!user) return setError('User not found. Please register first.')
    
    // Store current user
    localStorage.setItem('connunity_current_user', JSON.stringify(user))
    
    if (showNotification && showNotification.showSuccess) {
      showNotification.showSuccess(`Welcome back, ${user.username}!`)
    }
    
    // Clear form
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-icon-wrapper">
          <div className="login-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l2 2h-4l2-2z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="login-title">Welcome Back</h2>
        <div className="login-subtitle">Login to your Connunity account</div>

        <div className="login-card">
          <div className="card-title">Login</div>
          <div className="card-subtitle">Sign in to your account</div>

          <label className="form-label">Email</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l9 6 9-6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="btn-container">
            <button className="login-btn" onClick={submit} type="button">Login</button>
          </div>

          {showNotification && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Test Notifications:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => showNotification.showSuccess('Success notification!')} 
                  style={{ padding: '4px 8px', fontSize: '11px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Success
                </button>
                <button 
                  onClick={() => showNotification.showError('Error notification!')} 
                  style={{ padding: '4px 8px', fontSize: '11px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Error
                </button>
                <button 
                  onClick={() => showNotification.showWarning('Warning notification!')} 
                  style={{ padding: '4px 8px', fontSize: '11px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Warning
                </button>
                <button 
                  onClick={() => showNotification.showInfo('Info notification!')} 
                  style={{ padding: '4px 8px', fontSize: '11px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Info
                </button>
              </div>
            </div>
          )}

          <div className="login-footer">
            <span>Don't have an account? </span>
            <button className="link-btn" onClick={onSwitchToRegister}>Register</button>
          </div>

          {onAdminLogin && (
            <div className="admin-login-section">
              <button className="admin-btn" onClick={onAdminLogin}>Admin Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
