import React, { useState, useEffect } from 'react'
import '../App.css'

function readProfile(){ try{ const raw = localStorage.getItem('connunity_profile'); return raw ? JSON.parse(raw) : null; }catch{ return null; } }
function writeProfile(p){ try{ localStorage.setItem('connunity_profile', JSON.stringify(p)); return true; }catch{ return false; } }

export default function Profile({ open, onClose }){
  const [_profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', role:'', bio:'', avatarDataUrl:'' })

  useEffect(()=>{
    const p = readProfile(); if (p) { Promise.resolve().then(()=>{ setProfile(p); setForm({ name:p.name||'', email:p.email||'', role:p.role||'', bio:p.bio||'', avatarDataUrl:p.avatarDataUrl||'' }); }); }
  },[])

  function handleImage(e){ const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev=>{ setForm(s=>({...s, avatarDataUrl: ev.target.result})); }; r.readAsDataURL(f); }

  function save(){ const p = { name: form.name, email: form.email, role: form.role, bio: form.bio, avatarDataUrl: form.avatarDataUrl, avatarLetter: (form.name||'G')[0].toUpperCase() }; if (writeProfile(p)){ setProfile(p); setEditing(false); window.dispatchEvent(new Event('storage')); onClose && onClose(); } else { alert('Save failed'); } }

  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{display:'flex'}}>
      <div className="modal card" style={{width:680}}>
        <div style={{display:'flex',gap:16}}>
          <div style={{width:120}}>
            <div style={{width:96,height:96,borderRadius:999,overflow:'hidden',background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {form.avatarDataUrl ? <img src={form.avatarDataUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{fontSize:28,fontWeight:700}}>{(form.name||'G')[0].toUpperCase()}</div>}
            </div>
            <div style={{marginTop:8}}>
              <input type="file" accept="image/*" onChange={handleImage} />
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3>Profile</h3>
              <div>
                <button className="action-btn" type="button" onClick={()=>setEditing(e=>!e)}>{editing ? 'Cancel' : 'Edit'}</button>
                <button className="btn" type="button" onClick={save} style={{marginLeft:8}}>Save</button>
              </div>
            </div>
            <div style={{marginTop:8}}>
              <input value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} placeholder="Display name" style={{width:'100%',marginBottom:8}} />
              <input value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))} placeholder="Email" style={{width:'100%',marginBottom:8}} />
              <input value={form.role} onChange={e=>setForm(s=>({...s,role:e.target.value}))} placeholder="Role" style={{width:'100%',marginBottom:8}} />
              <textarea value={form.bio} onChange={e=>setForm(s=>({...s,bio:e.target.value}))} placeholder="Bio" rows={4} style={{width:'100%'}} />
            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button className="action-btn" onClick={onClose} type="button">Close</button>
        </div>
      </div>
    </div>
  )
}

