import React, { useState, useEffect } from 'react'
const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function UserDashboard({ open, onClose }){
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    if(!open) return
    const cur = (()=>{ try{ return JSON.parse(localStorage.getItem('connunity_current_user')) }catch{return null} })()
    if (!cur || !cur.id){ // fallback to local profile
      try{ const raw = localStorage.getItem('connunity_profile'); setProfile(raw? JSON.parse(raw): null) }catch(e){ console.warn(e) }
      try{ const p = localStorage.getItem('connunity_posts'); setPosts(p? JSON.parse(p):[]) }catch(e){ console.warn(e) }
      return
    }
    fetch(API + '/api/users').then(r=>r.json()).then(list=>{ const me = list.find(u=>u.id===cur.id); if(me) setProfile(me) }).catch((e)=>{ console.warn('fetch users failed', e) })
    fetch(API + '/api/posts').then(r=>r.json()).then(all=> setPosts(all.filter(p=> p.authorId === cur.id || p.author === cur.name || p.author === 'You'))).catch((e)=>{ try{ const p = localStorage.getItem('connunity_posts'); setPosts(p? JSON.parse(p):[]) }catch(err){ console.warn(err) } })
  },[open])

  if (!open) return null
  return (
    <div className="modal-backdrop" style={{display:'flex'}}>
      <div className="modal card" style={{width:760}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>User Dashboard</h3>
          <div><button className="action-btn" onClick={onClose}>Close</button></div>
        </div>
        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
          <div>
            <div className="card">
              <div style={{fontWeight:700}}>Activity</div>
              <div className="muted">No recent activity</div>
            </div>

            <div style={{marginTop:12}} className="card">
              <div style={{fontWeight:700}}>Your Posts</div>
                <div>
                  {posts.length ? posts.map(p=>{
                    const ts = p.createdAt || p.created || p.createdAtMs || 0
                    return (<div key={p.id} style={{padding:8,borderBottom:'1px solid #f1f5f9'}}><div style={{fontWeight:700}}>{p.title||p.text||'Post'}</div><div className="muted-small">{ts? new Date(ts).toLocaleString() : ''}</div></div>)
                  }) : <div className="muted">You haven't posted yet.</div>}
                </div>
            </div>
          </div>
          <aside>
            <div className="card">
              <div style={{fontWeight:700}}>Profile</div>
              <div style={{marginTop:8}}>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:56,height:56,borderRadius:999,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}>{profile? (profile.avatarLetter||profile.name && profile.name[0]) : 'G'}</div>
                  <div>
                    <div style={{fontWeight:700}}>{profile? profile.name : 'Guest'}</div>
                    <div className="muted-small">{profile? profile.email : '—'}</div>
                  </div>
                </div>
                <div style={{marginTop:12}}>
                  <button className="btn">Edit Profile</button>
                  <button className="action-btn" style={{marginLeft:8}} onClick={()=> window.dispatchEvent(new CustomEvent('openChangePassword'))}>Change Password</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
