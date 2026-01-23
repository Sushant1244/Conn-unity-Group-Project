import React, { useState } from 'react'
const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function ChangePassword({ open, onClose }){
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  if (!open) return null
  async function save(){
    if (!current || !next) return alert('Enter values')
    if (next !== confirm) return alert('Passwords do not match')
    const user = (()=>{ try{ return JSON.parse(localStorage.getItem('connunity_current_user')) }catch{return null} })()
    if (!user || !user.id){ try{ localStorage.setItem('connunity_demo_password', btoa(next)); alert('Password updated (demo)'); onClose && onClose(); return }catch(err){ console.warn(err); alert('Failed') } }
    try{
      const res = await fetch(API + '/api/users/' + user.id + '/change-password', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ current, next }) })
      if (!res.ok) throw new Error('failed')
      alert('Password updated')
      onClose && onClose()
    }catch(err){ try{ localStorage.setItem('connunity_demo_password', btoa(next)) }catch{}; alert('Password updated (demo)') }
  }
  return (
    <div className="modal-backdrop" style={{display:'flex'}}>
      <div className="modal card" style={{width:520}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Change Password</h3>
          <div><button className="action-btn" onClick={onClose}>Close</button></div>
        </div>
        <div style={{marginTop:12}}>
          <input type="password" placeholder="Current password" value={current} onChange={e=>setCurrent(e.target.value)} style={{width:'100%',marginBottom:8}} />
          <input type="password" placeholder="New password" value={next} onChange={e=>setNext(e.target.value)} style={{width:'100%',marginBottom:8}} />
          <input type="password" placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button className="btn" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
