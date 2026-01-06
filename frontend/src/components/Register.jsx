import React, { useState } from 'react'

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
      <div style={{maxWidth:420,width:'100%'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
          <div style={{width:72,height:72,borderRadius:18,background:'linear-gradient(180deg,#8b5cf6,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 12px 30px rgba(167,139,250,0.18)'}}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2 2h-4l2-2z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h2 style={{textAlign:'center',marginBottom:6,color:'#5b21b6'}}>Join Connunity</h2>
        <div className="muted" style={{textAlign:'center',marginBottom:12}}>Create your account and start connecting!</div>

        <div className="card register-card" style={{padding:18}}>
          <div style={{fontWeight:700,marginBottom:8}}>Create Account</div>
          <div className="muted-small" style={{marginBottom:12}}>Sign up to join our community</div>

          <label className="small">Username</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden>{/* user svg */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="cooluser123" />
          </div>

          <label className="small" style={{marginTop:8}}>Email</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8l9 6 9-6" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <label className="small" style={{marginTop:8}}>Password</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" />
          </div>

          <label className="small" style={{marginTop:8}}>Confirm Password</label>
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="********" />
          </div>

          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
            <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
            <div className="small">I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong></div>
          </div>

          {error && <div className="muted" style={{color:'#dc2626',marginTop:8}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'center',marginTop:12}}>
            <button className="btn create-btn" onClick={submit} type="button">Create Account</button>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:12}}>
          <a href="#" className="muted-small">Already have an account? Login</a>
        </div>
      </div>
    </div>
  )
}
