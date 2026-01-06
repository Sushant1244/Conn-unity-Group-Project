import React, { useState } from 'react'

function readChallenges(){ try{ const raw = localStorage.getItem('connunity_challenges'); return raw ? JSON.parse(raw) : null; }catch{ return null; } }
function writeChallenges(arr){ try{ localStorage.setItem('connunity_challenges', JSON.stringify(arr||[])); return true; }catch{ return false; } }

export default function CreateChallengeModal({ open, onClose }){
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState(100)
  if (!open) return null;

  function save(){ if (!title.trim()){ alert('Title required'); return; } const existing = readChallenges()||[]; const id = 'ch'+Math.random().toString(36).slice(2,8); existing.unshift({ id, title: title.trim(), progress:0, goal: Number(goal)||100 }); if (writeChallenges(existing)){ window.dispatchEvent(new Event('storage')); onClose && onClose(); } else alert('Save failed'); }

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Create Challenge</h3>
          <div><button className="action-btn" onClick={onClose} type="button">Close</button></div>
        </div>
        <div style={{marginTop:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Challenge title" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <input value={goal} onChange={e=>setGoal(e.target.value)} placeholder="Goal" style={{width:140,marginTop:8,padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
            <button className="btn" onClick={save} type="button">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
