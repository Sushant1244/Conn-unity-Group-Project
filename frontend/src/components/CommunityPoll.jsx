import React, { useState, useEffect } from 'react'

const API = window.__CONNUNITY_API__ || 'http://localhost:4000'

export default function CommunityPoll({ open, onClose }){
  const [poll, setPoll] = useState({ question:'Which feature should we build next?', options:[] })
  const [voted, setVoted] = useState(false)

  useEffect(()=>{ if (!open) return; fetch(API + '/api/poll').then(r=>r.json()).then(j=>setPoll(j)).catch(()=>{ setPoll(p=>p) }) },[open])

  if (!open) return null
  function vote(id){ if (voted) return; setVoted(true); fetch(API + '/api/poll/vote', { method:'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ optionId: id }) }).then(r=>r.json()).then(j=>setPoll(j)).catch(()=>{ setPoll(p=> ({ ...p, options: p.options.map(o=> o.id===id ? {...o, votes:(o.votes||0)+1} : o) })) }) }

  const total = (poll.options || []).reduce((s,o)=>s+(o.votes||0),0)
  return (
    <div className="modal-backdrop" style={{display:'flex'}}>
      <div className="modal card" style={{width:560}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Community Poll</h3>
          <div>
            <button className="action-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <div style={{fontWeight:700}}>{poll.question}</div>
          <div style={{marginTop:12,display:'grid',gap:8}}>
            {(poll.options||[]).map(o=> (
              <button key={o.id} className={`card ${voted? 'muted' : ''}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} onClick={()=>vote(o.id)}>
                <div>{o.text}</div>
                <div style={{minWidth:120,textAlign:'right'}}>{o.votes || 0} ({total? Math.round(((o.votes||0)/total)*100) : 0}%)</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
