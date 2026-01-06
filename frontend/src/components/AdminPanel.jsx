import React, { useState } from 'react'

export default function AdminPanel({ open, onClose }){
  const [tab, setTab] = useState('users')
  if (!open) return null;
  // demo data -- in a real app these would come from an API
  const users = [ { id:'u1', name:'Alice', email:'alice@example.com', role:'user' }, { id:'u2', name:'Bob', email:'bob@example.com', role:'moderator' } ];
  const communities = [ { id:'c1', name:'technology', members:2500 }, { id:'c2', name:'gaming', members:1800 } ];
  const posts = [ { id:'p1', title:'The Future of AI', author:'techEnthusiast42' }, { id:'p2', title:'Hidden Gem Indie Game', author:'PixelWarrior' } ];

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Admin Panel</h3>
          <div>
            <button className="action-btn" onClick={onClose} type="button">Close</button>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className={"action-btn" + (tab==='users' ? ' active' : '')} onClick={()=>setTab('users')}>Users</button>
          <button className={"action-btn" + (tab==='communities' ? ' active' : '')} onClick={()=>setTab('communities')}>Communities</button>
          <button className={"action-btn" + (tab==='posts' ? ' active' : '')} onClick={()=>setTab('posts')}>Posts</button>
        </div>

        {tab === 'users' && (
          <section style={{display:'grid',gridTemplateColumns:'1fr',gap:12,marginTop:12}}>
            <h4>Users</h4>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {users.map(u=> (
                <div key={u.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,borderRadius:8,border:'1px solid #eee'}}>
                  <div>
                    <div style={{fontWeight:700}}>{u.name}</div>
                    <div className="muted-small">{u.email} • {u.role}</div>
                  </div>
                  <div>
                    <button className="action-btn" style={{marginRight:8}}>Edit</button>
                    <button className="action-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'communities' && (
          <section style={{marginTop:12}}>
            <h4>Communities</h4>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {communities.map(c=> (
                <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,borderRadius:8,border:'1px solid #eee'}}>
                  <div>
                    <div style={{fontWeight:700}}>c/{c.name}</div>
                    <div className="muted-small">{(c.members||0).toLocaleString()} members</div>
                  </div>
                  <div>
                    <button className="action-btn">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'posts' && (
          <section style={{marginTop:12}}>
            <h4>Recent Posts</h4>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {posts.map(p=> (
                <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,borderRadius:8,border:'1px solid #eee'}}>
                  <div>
                    <div style={{fontWeight:700}}>{p.title}</div>
                    <div className="muted-small">by {p.author}</div>
                  </div>
                  <div>
                    <button className="action-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
