import React, { useState } from 'react'
import './Register.css'

export default function Register({ open, onClose }){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null;

  function submit(){
    setError('')
    if (!username.trim()) return setError('Username required')
    if (!email.includes('@')) return setError('Valid email required')
    if (password.length < 8) return setError('Password must be 8+ chars')
    if (password !== confirm) return setError('Passwords must match')
    if (!agree) return setError('You must agree to terms')
    // demo: persist minimal user
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    users.push({ id: 'u'+Date.now(), username, email })
    localStorage.setItem('connunity_users', JSON.stringify(users))
    onClose && onClose()
  }

  return (
    <div className="register-root">
      <div className="register-container">
        <div className="register-icon-wrapper">
          <div className="register-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l2 2h-4l2-2z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="register-title">Join Connunity</h2>
        <div className="register-subtitle">Create your account and start connecting!</div>

        <div className="register-card">
          <div className="card-title">Create Account</div>
          <div className="card-subtitle">Sign up to join our community</div>

          <label className="form-label">Username</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="cooluser123" />
          </div>

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

          <label className="form-label">Confirm Password</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="********" />
          </div>

          <div className="checkbox-container">
            <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
            <div className="checkbox-label">I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong></div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="btn-container">
            <button className="create-btn" onClick={submit} type="button">Create Account</button>
          </div>
        </div>

        <div className="login-link-container">
          <a href="#" className="login-link">Already have an account? <strong>Login</strong></a>
        </div>
      </div>
    </div>
  )
}