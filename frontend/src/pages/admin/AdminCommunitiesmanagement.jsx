import React, { useState, useEffect } from 'react'
const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function AdminCommunities({ open, onClose }){
  const [communities, setCommunities] = useState([])
  useEffect(()=>{ if(!open) return; fetch(API + '/api/communities').then(r=>r.json()).then(j=>setCommunities(j)).catch(()=>setCommunities([])) },[open])

  if (!open) return null
  function refresh(){ fetch(API + '/api/communities').then(r=>r.json()).then(j=>setCommunities(j)).catch(()=>{}) }
  function deleteCommunity(id){ if(!confirm('Delete community?')) return; fetch(API + '/api/communities/' + id, { method:'DELETE' }).then(()=> refresh()).catch(()=> setCommunities(cs=>cs.filter(c=>c.id!==id))) }
  function editCommunity(id){ const name = prompt('New name'); if(!name) return; fetch(API + '/api/communities/' + id, { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({ name }) }).then(()=> refresh()).catch(()=> setCommunities(cs=>cs.map(c=> c.id===id?{...c,name}:c))) }

  return (
    <div className="admin-backdrop">
      <div className="admin-shell card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0}}>Community Management</h2>
          <div>
            <button className="action-btn" onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{marginTop:16}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {communities.map(c=> (
              <div key={c.id} className="card" style={{padding:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>c/{c.name} <span style={{background:c.status==='Active' ? '#e6ffed' : '#f1f5f9', color:c.status==='Active' ? '#0b6b2e' : '#6b7280', padding:'2px 8px', borderRadius:8, fontSize:12}}>{c.status}</span></div>
                    <div style={{fontSize:13, color:'#6b7280', marginTop:6}}>{c.category}</div>
                    <div style={{marginTop:12,display:'flex',gap:24}}>
                      <div style={{textAlign:'center'}}><div style={{fontWeight:700}}>{c.members}</div><div className="muted-small">Members</div></div>
                      <div style={{textAlign:'center'}}><div style={{fontWeight:700}}>{c.posts}</div><div className="muted-small">Posts</div></div>
                      <div style={{textAlign:'center'}}><div style={{fontWeight:700,color:'#10b981'}}>{c.growth || ''}</div><div className="muted-small">Growth</div></div>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                    <button className="action-btn" style={{width:100}} onClick={()=>editCommunity(c.id)}>Edit</button>
                    <button className="danger-btn" onClick={()=>deleteCommunity(c.id)}>Delete</button>
                  </div>
                </div>
                <div style={{marginTop:10,color:'#6b7280'}}>Created {c.created || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
