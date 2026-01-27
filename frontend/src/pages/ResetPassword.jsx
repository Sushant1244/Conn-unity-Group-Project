import React, { useEffect, useState } from 'react'
import { resetPassword } from '../authService'

export default function ResetPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Read email from hash: #reset?email=...
    try {
      const hash = window.location.hash || ''
      const qIndex = hash.indexOf('?')
      if (qIndex !== -1) {
        const qs = new URLSearchParams(hash.slice(qIndex + 1))
        const e = qs.get('email')
        if (e) setEmail(e)
      }
    } catch {}
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const canSubmit = email && otp.length === 6 && password && password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      const data = await resetPassword({ email, otp, newPassword: password })
      if (data.success) {
        setDone(true)
        showToast('Password changed. You can login now.')
      } else {
        showToast(data.message || 'Failed to reset password')
      }
    } catch (err) {
      console.error('Reset failed', err)
      showToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8f5ff 0%, #fbf7fb 100%)', padding: 40 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 8 }}>Password Updated</div>
          <div style={{ color: '#6b7280', marginBottom: 16 }}>You can now login with your new password.</div>
          <button className="btn btn-primary" onClick={() => onBackToLogin && onBackToLogin()}>Go to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8f5ff 0%, #fbf7fb 100%)', padding: 40 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#111', color: '#fff', padding: '10px 14px', borderRadius: 8 }}>{toast}</div>
      )}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '92vw', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>🔑</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>Reset Password</div>
          <div style={{ color: '#806b79', fontSize: 14 }}>Enter the code from your email and set a new password.</div>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Email</div>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }} />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Reset Code</div>
            <input value={otp} onChange={(e)=>setOtp(e.target.value.replace(/[^0-9]/g,'').slice(0,6))} placeholder="000000" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'center', letterSpacing: 8, fontSize: 20 }} />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>New Password</div>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }} />
              <button type="button" onClick={()=>setShowPwd(!showPwd)} aria-label="Toggle password" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer' }}>{showPwd ? '🙈' : '👁️'}</button>
            </div>
          </label>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Confirm Password</div>
            <div style={{ position: 'relative' }}>
              <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb' }} />
              <button type="button" onClick={()=>setShowConfirm(!showConfirm)} aria-label="Toggle confirm password" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer' }}>{showConfirm ? '🙈' : '👁️'}</button>
            </div>
          </label>
          <button type="submit" disabled={!canSubmit || loading} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: canSubmit && !loading ? '#2563eb' : '#cbd5e1', color: '#fff', fontWeight: 800 }}>{loading ? 'Updating…' : 'Update Password'}</button>
          <button type="button" onClick={() => onBackToLogin && onBackToLogin()} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', background: 'transparent', color: '#111', fontWeight: 600, marginTop: 10 }}>Back to Login</button>
        </form>
      </div>
    </div>
  )
}
