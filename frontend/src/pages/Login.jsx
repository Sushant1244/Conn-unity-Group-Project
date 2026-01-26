import React, { useEffect, useState } from 'react';
import { login as authLogin, verifyOTP, resendOTP } from '../authService';

const Login = ({ onSignupClick, onAdminClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Verification state
  const [needsVerify, setNeedsVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState(null);
  const [toast, setToast] = useState(null);

  const toastPalette = {
    success: { bg: '#ecfdf5', border: '#34d399', text: '#065f46' },
    error: { bg: '#fef2f2', border: '#f87171', text: '#7f1d1d' },
    warning: { bg: '#fffbeb', border: '#fbbf24', text: '#92400e' },
    info: { bg: '#eff6ff', border: '#93c5fd', text: '#1e3a8a' },
  };

  const activeToastPalette = toast ? (toastPalette[toast.type] || toastPalette.info) : null;

  const canSubmit = email && password;

  const showToast = ({ type = 'info', title, message, duration = 5000 }) => {
    setToast({ id: Date.now(), type, title, message, duration });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const storedToast = sessionStorage.getItem('connunity_toast');
    if (storedToast) {
      try {
        const parsed = JSON.parse(storedToast);
        showToast(parsed);
      } catch (err) {
        console.warn('Failed to parse stored toast', err);
      } finally {
        sessionStorage.removeItem('connunity_toast');
      }
    }

    const storedEmail = sessionStorage.getItem('connunity_pending_verification_email');
    if (storedEmail) {
      setVerifyEmail(storedEmail);
      sessionStorage.removeItem('connunity_pending_verification_email');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const data = await authLogin({ email, password });
      if (data.success) {
        window.location.href = '/dashboard.html';
        return;
      }
      if (data.needsVerification) {
        setVerifyEmail(email);
        setNeedsVerify(true);
        setPendingCredentials({ email, password });
        showToast({
          type: 'warning',
          title: 'Verify your email',
          message: `We sent a verification code to ${email}. Enter it to finish logging in.`,
        });
        return;
      }
      showToast({ type: 'error', title: 'Login failed', message: data.message || 'Invalid credentials' });
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Login error', message: 'Unable to login right now. Please try again.' });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setIsVerifying(true);
    try {
      const data = await verifyOTP({ email: verifyEmail, otp });
      if (!data.success) {
        showToast({ type: 'error', title: 'Invalid code', message: data.message || 'OTP is invalid or expired.' });
        return;
      }

      showToast({ type: 'success', title: 'Email verified', message: 'Logging you in now…' });
      setNeedsVerify(false);
      setOtp('');
      setPendingCredentials(null);

      // verifyOTP() now stores token/user if returned
      if (data.token) {
        window.location.href = '/dashboard.html';
        return;
      }

      // Fallback to old behavior if backend doesn’t return token
      if (pendingCredentials) {
        const loginResult = await authLogin(pendingCredentials);
        if (loginResult.success) {
          window.location.href = '/dashboard.html';
          return;
        }
        showToast({ type: 'error', title: 'Login failed', message: loginResult.message || 'Please try again.' });
      } else {
        showToast({ type: 'info', title: 'Verified', message: 'Please login with your credentials.' });
      }
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Verification error', message: 'Unable to verify OTP. Try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const data = await resendOTP(verifyEmail);
      if (data.success) {
        showToast({ type: 'info', title: 'OTP sent', message: 'Check your inbox for the latest code.' });
      } else {
        showToast({ type: 'error', title: 'Resend failed', message: data.message || 'Unable to resend OTP.' });
      }
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Resend error', message: 'Something went wrong. Try again later.' });
    }
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
      {toast && activeToastPalette && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
          <div style={{
            minWidth: 280,
            maxWidth: 360,
            padding: '16px 20px',
            borderRadius: 12,
            border: `1px solid ${activeToastPalette.border}`,
            background: activeToastPalette.bg,
            color: activeToastPalette.text,
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            position: 'relative'
          }}>
            <button onClick={() => setToast(null)} style={{
              position: 'absolute',
              top: 10,
              right: 10,
              border: 'none',
              background: 'transparent',
              color: activeToastPalette.text,
              fontSize: 18,
              cursor: 'pointer'
            }}>×</button>
            {toast.title && <div style={{ fontWeight: 700, marginBottom: 6 }}>{toast.title}</div>}
            {toast.message && <div style={{ fontSize: 14, lineHeight: 1.4 }}>{toast.message}</div>}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <img src="/logo.jpeg" alt="Connunity Logo" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, boxShadow: '0 6px 18px rgba(110,82,255,0.18)' }} />
        <h1 style={{ margin: 0, fontSize: 28, color: '#5b2fff', fontWeight: 700 }}>Connunity</h1>
        <p style={{ margin: '8px 0 0', color: '#6b6b6b' }}>Welcome back! Please login to your account.</p>
      </div>

      {/* Verification Modal */}
      {needsVerify && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }} onClick={() => setNeedsVerify(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: 440, maxWidth: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setNeedsVerify(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6b6b6b' }}>×</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>🛡️</div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Verify Your Email</h2>
              <p style={{ margin: '8px 0 0', color: '#6b6b6b', fontSize: 14 }}>Enter the code sent to <strong>{verifyEmail}</strong></p>
            </div>
            <form onSubmit={handleVerifyOTP}>
              <label style={{ display: 'block', marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#1a1a1a' }}>Verification Code</div>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: 8, border: '2px solid #e5e5e5', fontSize: 20, textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
                />
              </label>
              <button type="submit" disabled={otp.length !== 6 || isVerifying} style={{ width: '100%', padding: '14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 12 }}>
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </button>
              <button type="button" onClick={handleResendOTP} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '2px solid #e5e5e5', background: 'transparent', color: '#6b6b6b', fontWeight: 600, cursor: 'pointer' }}>Resend Code</button>
            </form>
          </div>
        </div>
      )}

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
