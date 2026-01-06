import React, { useState } from 'react'

export default function Login({ open, onClose, onSuccess }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null;

  function submit(){
    setError('')
    if (!email.includes('@')) return setError('Please enter a valid email')
    if (!password) return setError('Password required')
    // demo: accept any password for now
    const user = { id: 'u' + Date.now(), email }
    onSuccess && onSuccess(user)
    onClose && onClose()
  }

  return (
    <div className="register-root">
      <div style={{maxWidth:420,width:'100%'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
          <div style={{width:72,height:72,borderRadius:18,background:'linear-gradient(180deg,#8b5cf6,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 12px 30px rgba(167,139,250,0.18)'}}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2 2h-4l2-2z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h2 style={{textAlign:'center',marginBottom:6,color:'#5b21b6'}}>Connunity</h2>
        <div className="muted" style={{textAlign:'center',marginBottom:12}}>Welcome back! Please login to your account.</div>

        <div className="card register-card" style={{padding:18}}>
          <div style={{fontWeight:700,marginBottom:8}}>Login</div>
          <div className="muted-small" style={{marginBottom:12}}>Enter your credentials to access your account</div>

          <label className="small">Email</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8l9 6 9-6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <label className="small" style={{marginTop:8}}>Password</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" />
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me</label>
            <a href="#" className="muted-small">Forgot password?</a>
          </div>

          {error && <div className="muted" style={{color:'#dc2626',marginTop:8}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'center',marginTop:12}}>
            <button className="btn create-btn" onClick={submit} type="button">Login</button>
          </div>

          <div style={{borderTop:'1px solid #eee',marginTop:12,paddingTop:12,textAlign:'center'}}>
            <div className="muted-small">Don't have an account? <a href="#">Sign up</a></div>
            <button className="action-btn" style={{marginTop:8,width:'100%'}}>Admin Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}
