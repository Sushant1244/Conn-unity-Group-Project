import React, { useState, useEffect } from 'react'

const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function DailyChallenges({ open, onClose }){
  const [challenges, setChallenges] = useState([])

  useEffect(()=>{ if(!open) return; fetch(API + '/api/challenges').then(r=>r.json()).then(j=>setChallenges(j)).catch(()=> setChallenges([])) },[open])

  if (!open) return null
  function complete(id){ const user = (()=>{ try{ return JSON.parse(localStorage.getItem('connunity_current_user')) }catch{return null} })(); const userId = user && user.id ? user.id : ('u_demo'); fetch(API + '/api/challenges/complete', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ challengeId: id, userId }) }).then(r=>r.json()).then(updated=>{
    setChallenges(cs=>cs.map(c=> c.id===id? updated : c ))
  }).catch(()=>{ /* fallback: mark locally */ setChallenges(cs=>cs.map(c=> c.id===id? {...c, completedBy: [...(c.completedBy||[]), userId]} : c)) }) }

  return (
    <div className="modal-backdrop" style={{display:'flex'}}>
      <div className="modal card" style={{width:560}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Daily Challenges</h3>
          <div>
            <button className="action-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <div style={{display:'grid',gap:12}}>
            {challenges.map(c=> (
              <div key={c.id} className="card" style={{padding:10,display:'flex',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontWeight:700}}>{c.title}</div>
                  <div className="muted-small">{c.reward || '+0 XP'}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" onClick={()=>complete(c.id)}>Do</button>
                  <button className="action-btn" onClick={()=>complete(c.id)}>Claim</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
