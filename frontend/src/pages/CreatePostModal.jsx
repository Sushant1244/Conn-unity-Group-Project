import React, { useState, useEffect } from 'react'

const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

function readPosts(){ try{ const raw = localStorage.getItem('connunity_posts'); return raw ? JSON.parse(raw) : []; }catch{ return []; } }
function writePosts(arr){ try{ localStorage.setItem('connunity_posts', JSON.stringify(arr||[])); return true; }catch{ return false; } }

export default function CreatePostModal({ open, onClose }){
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [community, setCommunity] = useState('')
  const [imageData, setImageData] = useState('')
  const [communities, setCommunities] = useState([])

  useEffect(()=>{
  try{ const raw = localStorage.getItem('connunity_communities'); if (raw) Promise.resolve().then(()=> setCommunities(JSON.parse(raw))); }
  catch(err){ console.warn('read communities failed', err); }
  },[])

  function handleImage(e){ const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setImageData(ev.target.result); r.readAsDataURL(f); }

  function save(){
    if (!title.trim()) { alert('Title required'); return; }
    const item = { title: title.trim(), body: body.trim(), community: community || (communities[0] && communities[0].name) || 'general', image: imageData, author: 'You' };
    fetch(API + '/api/posts', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(item) }).then(r=>r.json()).then(created=>{
      // broadcast change
      window.dispatchEvent(new Event('storage'));
      onClose && onClose();
      setTitle(''); setBody(''); setCommunity(''); setImageData('');
    }).catch(()=>{
      // fallback to local
      const posts = readPosts(); const id = 'p' + Math.random().toString(36).slice(2,9); const fallback = { id, ...item, createdAt: Date.now(), likes:0, dislikes:0, comments:[] }; posts.unshift(fallback); if (writePosts(posts)){ window.dispatchEvent(new Event('storage')); onClose && onClose(); setTitle(''); setBody(''); setCommunity(''); setImageData(''); } else { alert('Save failed') }
    })
  }

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <h3>Create Post</h3>
        <div style={{marginTop:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} placeholder="Body (optional)" style={{width:'100%',marginTop:8,padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <select value={community} onChange={e=>setCommunity(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #e6e6e6'}}>
              <option value="">Select community</option>
              {communities.map(c=> <option key={c.id} value={c.name}>c/{c.name}</option>)}
            </select>
            <label className="action-btn" style={{display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer'}}>
              Upload image
              <input type="file" accept="image/*" onChange={handleImage} style={{display:'none'}} />
            </label>
          </div>
          {imageData && <img src={imageData} alt="preview" style={{maxWidth:'100%',marginTop:8,borderRadius:8}} />}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="action-btn" onClick={onClose} type="button">Cancel</button>
            <button className="btn" onClick={save} type="button">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
