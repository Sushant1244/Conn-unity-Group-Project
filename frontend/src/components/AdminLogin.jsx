import React, { useState } from 'react'

export default function AdminLogin({ open, onClose, onSuccess }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (!open) return null;

  function submit(){
    setError('')
    if (!username.trim()) { setError('Username required'); return }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (code !== '123456') { setError('Invalid security code'); return }
    // demo success
    onSuccess && onSuccess();
    onClose && onClose();
  }

  return (
    <div className="admin-login-root">
      <div style={{maxWidth:420,width:'100%'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
          <div style={{width:72,height:72,borderRadius:14,background:'linear-gradient(180deg,#ff7ab6,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 12px 40px rgba(124,58,237,0.18)'}}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2 2h-4l2-2z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="7" width="18" height="13" rx="2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h2 style={{textAlign:'center',marginBottom:6}}>Admin Portal</h2>
        <div className="muted" style={{textAlign:'center',marginBottom:12}}>Secure administrative access</div>

        <div className="card" style={{padding:16}}>
          <div style={{fontWeight:700,marginBottom:8}}>Administrator Login</div>
          <div className="muted-small" style={{marginBottom:12}}>Enter your admin credentials to access the control panel</div>

          <label className="small">Admin Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" />

          <label className="small" style={{marginTop:8}}>Admin Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="**********" />

          <label className="small" style={{marginTop:8}}>Security Code (2FA)</label>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="000000" />

          {error && <div className="muted" style={{color:'#dc2626',marginTop:8}}>{error}</div>}

          <div style={{display:'flex',justifyContent:'center',marginTop:12}}>
            <button className="btn" onClick={submit} type="button">Access Admin Panel</button>
          </div>
          <div style={{textAlign:'center',marginTop:10}}>
            <a href="#" className="muted-small">Request access recovery</a>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div className="card" style={{border:'1px solid rgba(245,158,11,0.18)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><strong>Security Notice</strong></div>
            <div className="muted-small" style={{marginTop:8}}>All administrative actions are logged and monitored. Unauthorized access attempts will be reported.</div>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div className="card" style={{background:'#2b2b8a',color:'#e6eefc'}}>
            <div className="small"><strong>Demo Credentials:</strong></div>
            <div className="small">Username: admin</div>
            <div className="small">Password: any 8+ chars</div>
            <div className="small">Security Code: 123456</div>
          </div>
        </div>
      </div>
    </div>
  )
}
