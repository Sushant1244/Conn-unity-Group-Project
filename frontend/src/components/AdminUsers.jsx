import React, { useState, useEffect } from 'react'
const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function AdminUsers({ open, onClose }){
  const [users, setUsers] = useState([])
  useEffect(()=>{ if(!open) return; fetch(API + '/api/users').then(r=>r.json()).then(j=>setUsers(j)).catch(()=>setUsers([])) },[open])
  if (!open) return null

  function refresh(){ fetch(API + '/api/users').then(r=>r.json()).then(j=>setUsers(j)).catch(()=>{}) }

  function toggleBan(id){ // demo: delete user as suspend
    fetch(API + '/api/users/' + id, { method:'DELETE' }).then(()=> refresh()).catch(()=>{ setUsers(us=>us.map(u=> u.id===id?{...u,status: u.status==='Banned' ? 'Active' : 'Banned'}:u)) })
  }
  function promote(id){ fetch(API + '/api/users/' + id, { method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({ role: 'Moderator' }) }).then(()=> refresh()).catch(()=>{ setUsers(us=>us.map(u=> u.id===id?{...u, role: 'Moderator'}:u)) }) }

  return (
    <div className="admin-backdrop">
      <div className="admin-shell card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0}}>User Management</h2>
          <div>
            <button className="action-btn" onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{marginTop:16}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input placeholder="Search by username or email..." style={{flex:1}} />
            <select><option>All Roles</option></select>
            <select><option>All Status</option></select>
          </div>

          <table style={{width:'100%',marginTop:12,borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left',color:'#6b7280'}}>
                <th style={{padding:10}}>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Posts</th>
                <th>Karma</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{borderTop:'1px solid #eef2f6'}}>
                  <td style={{padding:12}}>
                    <div style={{fontWeight:700}}>{u.name || u.username || u.id}</div>
                    <div className="muted-small">{u.email}</div>
                  </td>
                  <td>{u.role}</td>
                  <td><span style={{background:u.status==='Active' ? '#e6ffed' : (u.status==='Banned' ? '#fee2e2' : '#f3f4f6'), padding:'4px 8px', borderRadius:8}}>{u.status || 'Active'}</span></td>
                  <td>{u.posts || 0}</td>
                  <td style={{color:'#10b981'}}>{u.karma || 0}</td>
                  <td>{u.joined || '-'}</td>
                  <td style={{padding:12}}>
                    <button className="action-btn" onClick={()=>toggleBan(u.id)}>Suspend</button>
                    <button className="action-btn" style={{marginLeft:8}} onClick={()=>promote(u.id)}>Promote</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
