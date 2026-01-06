import React, { useState } from 'react'

function readCommunities(){ try{ const raw = localStorage.getItem('connunity_communities'); return raw ? JSON.parse(raw) : null; }catch{ return null; } }
function writeCommunities(arr){ try{ localStorage.setItem('connunity_communities', JSON.stringify(arr||[])); return true; }catch{ return false; } }

export default function CreateCommunityModal({ open, onClose }){
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  if (!open) return null;

  function save(){
    if (!name.trim()) { alert('Name required'); return; }
    const existing = readCommunities() || [];
    const id = 'c' + Math.random().toString(36).slice(2,8);
    const item = { id, name: name.trim(), desc: desc.trim(), members: 0 };
    existing.unshift(item);
    if (writeCommunities(existing)){ window.dispatchEvent(new Event('storage')); onClose && onClose(); } else { alert('Save failed'); }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Create Community</h3>
          <div><button className="action-btn" onClick={onClose} type="button">Close</button></div>
        </div>
        <div style={{marginTop:12}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Community name (no spaces)" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" rows={3} style={{width:'100%',marginTop:8,padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
            <button className="btn" onClick={save} type="button">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
