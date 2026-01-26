import React, { useEffect, useMemo, useState } from 'react';
import { verifyOTP, resendOTP } from '../authService';

const VerifyOtp = ({ onBackToLogin, onBackToRegister }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [toast, setToast] = useState(null);

  const toastPalette = useMemo(
    () => ({
      success: { bg: '#ecfdf5', border: '#34d399', text: '#065f46' },
      error: { bg: '#fef2f2', border: '#f87171', text: '#7f1d1d' },
      warning: { bg: '#fffbeb', border: '#fbbf24', text: '#92400e' },
      info: { bg: '#eff6ff', border: '#93c5fd', text: '#1e3a8a' },
    }),
    []
  );

  const activeToastPalette = toast ? (toastPalette[toast.type] || toastPalette.info) : null;

  const showToast = ({ type = 'info', title, message, duration = 5000 }) => {
    setToast({ id: Date.now(), type, title, message, duration });
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('connunity_pending_verification_email');
    if (storedEmail) setEmail(storedEmail);

    const storedToast = sessionStorage.getItem('connunity_toast');
    if (storedToast) {
      try {
        showToast(JSON.parse(storedToast));
      } catch {
        // ignore
      } finally {
        sessionStorage.removeItem('connunity_toast');
      }
    }
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(timeout);
  }, [toast]);

  const canSubmit = email && otp.length === 6 && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const data = await verifyOTP({ email, otp });
      if (!data.success) {
        showToast({ type: 'error', title: 'Invalid code', message: data.message || 'OTP is invalid or expired.' });
        return;
      }

      showToast({ type: 'success', title: 'Verified', message: 'Logging you in…' });
      sessionStorage.removeItem('connunity_pending_verification_email');

      // verifyOTP() now stores token/user if returned
      if (data.token) {
        window.location.href = '/dashboard.html';
        return;
      }

      // Fallback: if backend didn’t send token for some reason
      showToast({ type: 'info', title: 'Verified', message: 'Please login to continue.' });
      if (onBackToLogin) onBackToLogin();
      else window.location.hash = '#login';
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Verification error', message: 'Unable to verify OTP. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast({ type: 'warning', title: 'Email required', message: 'Enter your email to resend the code.' });
      return;
    }

    setIsResending(true);
    try {
      const data = await resendOTP(email);
      if (data.success) {
        showToast({ type: 'info', title: 'OTP sent', message: 'Check your inbox for the latest code.' });
      } else {
        showToast({ type: 'error', title: 'Resend failed', message: data.message || 'Unable to resend OTP.' });
      }
    } catch (err) {
      console.error(err);
      showToast({ type: 'error', title: 'Resend error', message: 'Something went wrong. Try again later.' });
    } finally {
      setIsResending(false);
    }
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
        <img
          src="/logo.jpeg"
          alt="Connunity Logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 12,
            boxShadow: '0 6px 18px rgba(110,82,255,0.18)'
          }}
        />
        <h1 style={{ margin: 0, fontSize: 28, color: '#5b2fff', fontWeight: 700 }}>Verify your email</h1>
        <p style={{ margin: '8px 0 0', color: '#6b6b6b' }}>Enter the 6-digit OTP sent to your inbox.</p>
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
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.06)',
              background: '#f6f6f6',
              outline: 'none'
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>OTP Code</div>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.06)',
              background: '#f6f6f6',
              outline: 'none',
              fontSize: 20,
              textAlign: 'center',
              letterSpacing: '8px'
            }}
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            background: canSubmit ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#dcdcdc',
            color: canSubmit ? '#fff' : '#777',
            fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit ? '0 6px 18px rgba(102,126,234,0.25)' : 'none',
            marginBottom: 10
          }}
        >
          {isSubmitting ? 'Verifying…' : 'Verify & Login'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 8,
            border: '2px solid #e5e5e5',
            background: 'transparent',
            color: '#6b6b6b',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 14
          }}
        >
          {isResending ? 'Sending…' : 'Resend Code'}
        </button>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button type="button" onClick={onBackToLogin} style={{ border: 'none', background: 'transparent', color: '#111', fontWeight: 700, cursor: 'pointer' }}>
            Back to Login
          </button>
          <span style={{ color: '#c0c0c0' }}>|</span>
          <button type="button" onClick={onBackToRegister} style={{ border: 'none', background: 'transparent', color: '#111', fontWeight: 700, cursor: 'pointer' }}>
            Back to Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
