import React, { useState, useEffect } from 'react'

function readProfile() {
  try {
    const raw = localStorage.getItem('connunity_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeProfile(p) {
  try {
    localStorage.setItem('connunity_profile', JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export default function SidebarProfile({ onOpenProfile }){
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', role:'' })

  useEffect(()=>{ const p = readProfile(); if (p) Promise.resolve().then(()=> setProfile(p)); },[])

  useEffect(()=>{
    function onStorage(e){ if (e.key === 'connunity_profile'){ const p = readProfile(); setProfile(p); } }
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[])

  function startEdit(){ const p = profile || { name:'Guest', email:'', role:'Visitor' }; setForm({ name: p.name||'', email: p.email||'', role: p.role||'' }); setEditing(true); }
  function cancelEdit(){ setEditing(false); }
  function saveEdit(){ const existing = profile || { name:'Guest' }; const p = { ...existing, name: form.name || existing.name, email: form.email || existing.email, role: form.role || existing.role }; p.avatarLetter = (p.name||'G')[0].toUpperCase(); if (writeProfile(p)){ setProfile(p); setEditing(false); window.dispatchEvent(new Event('storage')); } else { alert('Save failed'); } }

  return (
    <>
    <div className="card profile-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="avatar" style={{cursor:'pointer'}} onClick={onOpenProfile}>{(profile && (profile.avatarLetter || (profile.name && profile.name[0]))) || 'G'}</div>
          <div style={{fontWeight:700}}>Your profile</div>
        </div>
        <div className="pill">{(profile && profile.role) || 'Visitor'}</div>
      </div>
      <div className="muted" style={{marginTop:8}}>Your personal page. Create posts and join communities.</div>
      <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8}}>
        <button className="btn" type="button" onClick={()=> window.dispatchEvent(new CustomEvent('openCreatePost'))}>Create Post</button>
        <button className="action-btn" type="button" onClick={()=> window.dispatchEvent(new CustomEvent('openCreateCommunity'))}>Create Community</button>
      </div>
      <div style={{marginTop:10,display:'flex',gap:8,alignItems:'center'}}>
        <button className="action-btn" type="button" onClick={startEdit}>Edit</button>
      </div>
      {editing && (
        <div style={{marginTop:8}}>
          <input value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} placeholder="Display name" />
          <input value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))} placeholder="Email" />
          <input value={form.role} onChange={e=>setForm(s=>({...s,role:e.target.value}))} placeholder="Role" />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
            <button className="action-btn" type="button" onClick={cancelEdit}>Cancel</button>
            <button className="btn" type="button" onClick={saveEdit}>Save</button>
          </div>
        </div>
      )}
    </div>
    
    <div className="card" style={{marginTop:12}}>
      <div style={{fontWeight:700, marginBottom:8}}>Popularity Community</div>
      <div className="community-list">
  {['c/technology','c/gaming','c/nature','c/cooking','c/programming'].map((c)=> (
          <div key={c} className="community-item">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div className="avatar" style={{width:32,height:32,fontSize:13}}>{c[2].toUpperCase()}</div>
              <div style={{fontSize:13}}>{c}<div className="muted-small" style={{fontSize:11}}>2.3k members</div></div>
            </div>
            <button className="action-btn">Join</button>
          </div>
        ))}
      </div>
      <div style={{marginTop:8,textAlign:'right'}}><a href="#">View All Community</a></div>
    </div>

    <div className="card" style={{marginTop:12}}>
      <div style={{fontWeight:700, marginBottom:8}}>Daily Challenges</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div>
          <div style={{display:'flex',justifyContent:'space-between'}}><div>Community Contributor</div><div className="small muted-small">Easy</div></div>
          <div style={{height:8, background:'#f1f5f9', borderRadius:8, marginTop:8}}><div style={{width:'60%',height:'8px',background:'linear-gradient(90deg,#7c3aed,#22c1c3)',borderRadius:8}}></div></div>
        </div>
        <div>
          <div style={{display:'flex',justifyContent:'space-between'}}><div>Conversation Starter</div><div className="small muted-small">Medium</div></div>
          <div style={{height:8, background:'#f1f5f9', borderRadius:8, marginTop:8}}><div style={{width:'30%',height:'8px',background:'linear-gradient(90deg,#f97316,#f59e0b)',borderRadius:8}}></div></div>
        </div>
      </div>
    </div>

    <div className="card" style={{marginTop:12}}>
      <div style={{fontWeight:700, marginBottom:8}}>About Community</div>
      <div className="muted-small">A friendly place to share ideas, discover new communities and meet creators.</div>
    </div>
    </>
  )
}
