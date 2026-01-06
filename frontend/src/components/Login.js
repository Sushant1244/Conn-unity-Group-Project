import React, { useState } from 'react'
import './Login.css'

export default function Login({ open, onClose, onSwitchToRegister, onAdminLogin }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null;

  function submit(){
    setError('')
    if (!email.includes('@')) return setError('Valid email required')
    if (password.length < 6) return setError('Password required')
    
    // Demo: check localStorage for existing users
    const usersRaw = localStorage.getItem('connunity_users') || '[]'
    const users = JSON.parse(usersRaw)
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return setError('No account found with this email')
    }
    
    // In a real app, you'd verify the password
    console.log('Login successful:', user)
    onClose && onClose(user)
  }

  function handleForgotPassword(e){
    e.preventDefault()
    alert('Password reset functionality coming soon!')
  }

  function handleSignUp(e){
    e.preventDefault()
    onSwitchToRegister && onSwitchToRegister()
  }

  function handleAdminLogin(){
    onAdminLogin && onAdminLogin()
  }

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="login-icon-wrapper">
          <div className="login-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 14c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="6" r="2" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="6" cy="6" r="2" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        <h2 className="login-title">Connunity</h2>
        <div className="login-subtitle">Welcome back! Please login to your account.</div>

        <div className="login-card">
          <div className="card-title">Login</div>
          <div className="card-subtitle">Enter your credentials to access your account</div>

          <label className="form-label">Email</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l9 6 9-6M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8l9-4 9 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="········" 
            />
            <button 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l18 18M10.5 10.5a2 2 0 0 0 2.83 2.83M12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7C3.732 7.943 7.522 5 12 5z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C7.522 5 3.732 7.943 2.458 12c1.274 4.057 5.064 7 9.542 7 4.478 0 8.268-2.943 9.542-7C20.268 7.943 16.478 5 12 5z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          <div className="login-options">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="remember-checkbox" 
                checked={remember} 
                onChange={e=>setRemember(e.target.checked)} 
              />
              <label htmlFor="remember-checkbox" className="checkbox-label">
                Remember me
              </label>
            </div>
            <a href="#" className="forgot-password" onClick={handleForgotPassword}>
              Forgot password?
            </a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="btn-container">
            <button className="login-btn" onClick={submit} type="button">Login</button>
          </div>
        </div>

        <div className="signup-link-container">
          <a href="#" className="signup-link" onClick={handleSignUp}>
            Don't have an account? <strong>Sign up</strong>
          </a>
        </div>

        <button className="admin-login-btn" onClick={handleAdminLogin} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l-8 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Admin Login
        </button>
      </div>
    </div>
  )
}
