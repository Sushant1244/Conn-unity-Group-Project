import React, { useState } from 'react';
import { register as authRegister } from '../authService';

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = password && password === confirmPassword;
  const canSubmit = username && email && passwordsMatch && agree;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Use client-side demo auth service
    authRegister({ username, email, password }).then(data => {
      if (data.success) {
        // redirect to dashboard demo
        window.location.href = '/dashboard.html';
      } else {
        alert('Error: ' + (data.message || 'unknown'))
      }
    }).catch(err => {
      console.error(err)
      alert('Registration error')
    })
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
        <h1 style={{ margin: 0, fontSize: 28, color: '#5b2fff', fontWeight: 700 }}>Join Connunity</h1>
        <p style={{ margin: '8px 0 0', color: '#6b6b6b' }}>Create your account and start connecting!</p>
      </div>

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
          <div style={{ fontWeight: 700, fontSize: 16 }}>Create Account</div>
          <div style={{ color: '#8a8a8a', marginTop: 6 }}>Sign up to join our community</div>
        </div>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Username</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>👤</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cooluser123"
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

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Confirm Password</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bdbdbd' }}>🔒</span>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirm ? 'text' : 'password'}
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
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
              position: 'absolute', right: 10,
              top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b'
            }} aria-label="Toggle confirm password">
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <div style={{ color: '#d9534f', marginTop: 8, fontSize: 13 }}>Passwords do not match</div>
          )}
        </label>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, margin: '8px 0 18px' }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 16, height: 16 }} />
          <div style={{ fontSize: 14, color: '#333' }}>
            I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
          </div>
        </label>

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
            Create Account
          </button>

          
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)', margin: '10px 0 14px' }} />

        <div style={{ textAlign: 'center', color: '#6b6b6b' }}>
          Already have an account?{' '}
          <button type="button" onClick={onLoginClick} style={{ border: 'none', background: 'transparent', color: '#111', fontWeight: 700, cursor: 'pointer' }}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
