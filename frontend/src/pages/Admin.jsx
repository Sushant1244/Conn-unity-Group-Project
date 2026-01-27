import React, { useState } from 'react'

const Admin = ({ onBack }) => {
  const [username, setUsername] = useState('Developer@gmail.com')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const canSubmit = username && password && code.length === 6

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    const expectedEmail = 'developer@gmail.com'
    const expectedPassword = 'connunity@123'
    const expectedCode = '99390D'

    // Client-side acceptance for the requested exact credentials
    if (username.trim().toLowerCase() === expectedEmail && password === expectedPassword && code.toUpperCase() === expectedCode) {
      localStorage.setItem('connunity_admin_token', 'mock-admin-token')
      const target = window.location.origin + '/admin.html'
      window.location.replace(target)
      return
    }

    // Otherwise, call mock admin login (direct backend in dev)
    const apiBase = (import.meta?.env?.DEV ? 'http://localhost:4000' : '')
    const url = apiBase + '/api/admin-login'
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, code })
    }).then(r => r.json()).then(data => {
      if (data.success) {
        // store token and redirect to admin dashboard
        localStorage.setItem('connunity_admin_token', data.token || 'mock-admin-token')
        const target = window.location.origin + '/admin.html'
        window.location.replace(target)
      } else {
        alert('Error: ' + (data.message || 'unknown'))
      }
    }).catch(err => {
      console.error(err)
      // Fallback to same-origin in case proxy is configured
      fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, code })
      }).then(r => r.json()).then(data => {
        if (data.success) {
          localStorage.setItem('connunity_admin_token', data.token || 'mock-admin-token')
          const target = window.location.origin + '/admin.html'
          window.location.replace(target)
        } else {
          alert('Error: ' + (data.message || 'unknown'))
        }
      }).catch(() => {
        alert('Network error (backend not reachable). Ensure backend is running on http://localhost:4000')
      })
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f8f5ff 0%, #fbf7fb 100%)',
      padding: '48px'
    }}>
      <div style={{ position: 'absolute', left: 24, top: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>← Back to User Login</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          margin: '0 auto 12px',
          background: 'linear-gradient(135deg,#6a4ef6,#8e63ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(110,82,255,0.18)'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 6v6c0 5 4 9 9 10s9-5 9-10V6l-9-4z" fill="white" opacity="0.95"/>
          </svg>
        </div>
        <h1 style={{ margin: 0, fontSize: 28, color: '#5b2fff', fontWeight: 700 }}>Admin Portal</h1>
        <p style={{ margin: '8px 0 0', color: '#6b6b6b' }}>Secure administrative access</p>
        <div style={{ display: 'inline-block', marginTop: 12, padding: '6px 12px', background: '#fff4f6', color: '#ff4b4b', borderRadius: 8, fontWeight: 700, border: '1px solid rgba(255,75,75,0.08)' }}>⚠️ Restricted Access</div>
      </div>

      <form onSubmit={handleSubmit} style={{
        width: 520,
        maxWidth: '94vw',
        background: '#fff',
        borderRadius: 12,
        padding: 22,
        boxShadow: '0 8px 30px rgba(15, 15, 15, 0.06)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{ marginBottom: 14, color: '#333' }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Administrator Login</div>
          <div style={{ color: '#8a8a8a', marginTop: 6 }}>Enter your admin credentials to access the control panel</div>
        </div>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>Admin Username</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>🔐</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#f6f6f6',
                color: '#111',
                outline: 'none'
              }}
            />
          </div>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>Admin Password</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>🔒</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 40px 12px 40px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#f6f6f6',
                color: '#111',
                outline: 'none'
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
              position: 'absolute', right: 10,
              top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b'
            }} aria-label="Toggle password">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>Security Code (2FA)</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>🔑</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,6))}
              placeholder="000000 or ABC123"
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#f6f6f6',
                color: '#111',
                outline: 'none',
                letterSpacing: 4
              }}
            />
          </div>
        </label>

        <div style={{ color: '#8a8a8a', fontSize: 13, marginBottom: 14 }}>Enter the 6-character code from your authenticator app. <span style={{ color: '#5b2fff', fontWeight: 600 }}>Demo code: 99390D</span></div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              background: canSubmit ? '#07060a' : '#dcdcdc',
              color: canSubmit ? '#fff' : '#777',
              fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 6px 18px rgba(7,6,10,0.18)' : 'none'
            }}
          >
            Access Admin Panel
          </button>
        </div>

        <div style={{ textAlign: 'center', color: '#6b6b6b', marginTop: 8 }}>
          <button type="button" onClick={() => alert('Request access recovery (demo)')} style={{ background: 'transparent', border: 'none', color: '#111', cursor: 'pointer' }}>Request access recovery</button>
        </div>
      </form>
    </div>
  )
}

export default Admin
