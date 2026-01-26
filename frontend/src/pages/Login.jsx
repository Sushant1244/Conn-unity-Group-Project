import React, { useState } from 'react';
import { login as authLogin } from '../authService';

const Login = ({ onSignupClick, onAdminClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const canSubmit = email && password;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Use client-side demo auth service
    authLogin({ email, password }).then(data => {
      if (data.success) {
        // redirect to dashboard demo
        window.location.href = '/dashboard.html';
      } else {
        alert('Error: ' + (data.message || 'unknown'))
      }
    }).catch(err => {
      console.error(err)
      alert('Login error')
    })
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Please enter your email address');
      return;
    }
    
    // Simulate sending reset email
    setTimeout(() => {
      setResetSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail('');
      }, 3000);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f8f5ff 0%, #fbf7fb 100%)',
      padding: '40px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <img src="/logo.jpeg" alt="Connunity Logo" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, boxShadow: '0 6px 18px rgba(110,82,255,0.18)' }} />
        <h1 style={{ margin: 0, fontSize: 28, color: '#5b2fff', fontWeight: 700 }}>Connunity</h1>
        <p style={{ margin: '8px 0 0', color: '#6b6b6b' }}>Welcome back! Please login to your account.</p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowForgotPassword(false)}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            width: 440,
            maxWidth: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowForgotPassword(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#6b6b6b',
                padding: 4
              }}
            >×</button>
            
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginBottom: 16
              }}>🔑</div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Forgot Password?</h2>
              <p style={{ margin: '8px 0 0', color: '#6b6b6b', fontSize: 14 }}>
                {resetSent ? 'Check your email!' : 'Enter your email and we\'ll send you a reset link'}
              </p>
            </div>

            {resetSent ? (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 8,
                padding: 16,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <div style={{ color: '#166534', fontWeight: 600, marginBottom: 4 }}>Reset link sent!</div>
                <div style={{ color: '#15803d', fontSize: 14 }}>
                  Check your inbox at <strong>{resetEmail}</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <label style={{ display: 'block', marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#1a1a1a' }}>Email Address</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>📧</span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 46px',
                        borderRadius: 8,
                        border: '2px solid #e5e5e5',
                        fontSize: 15,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    marginBottom: 12
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 8,
                    border: '2px solid #e5e5e5',
                    background: 'transparent',
                    color: '#6b6b6b',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        width: 420,
        maxWidth: '92vw',
        background: '#fff',
        borderRadius: 12,
        padding: 22,
        boxShadow: '0 8px 30px rgba(15, 15, 15, 0.06)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Login</div>
          <div style={{ color: '#8a8a8a', marginTop: 6 }}>Enter your credentials to access your account</div>
        </div>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Email</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>✉️</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#f6f6f6',
                outline: 'none'
              }}
            />
            
          </div>
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Password</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>🔒</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 40px 12px 40px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#f6f6f6',
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#333', display: 'inline-block', marginRight: 6 }} />
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 16, height: 16 }} />
            <span style={{ marginLeft: 6, color: '#333' }}>Remember me</span>
          </label>
          <button 
            type="button" 
            onClick={() => setShowForgotPassword(true)} 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: '#5b2fff', 
              fontWeight: 600, 
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#764ba2'}
            onMouseOut={(e) => e.target.style.color = '#5b2fff'}
          >
            Forgot password?
          </button>
        </div>

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
            Login
          </button>

          
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '10px 0 14px' }} />

        <div style={{ textAlign: 'center', color: '#6b6b6b', marginBottom: 12 }}>
          Don't have an account?{' '}
          <button type="button" onClick={onSignupClick} style={{ border: 'none', background: 'transparent', color: '#111', fontWeight: 700, cursor: 'pointer' }}>Sign up</button>
        </div>

        <button type="button" onClick={onAdminClick} style={{
          width: '100%',
          padding: '10px',
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'transparent',
          color: '#111',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          🔐 Admin Login
        </button>
      </form>
    </div>
  );
};

export default Login;
