import React, { useState, useEffect } from 'react'

const initialState = {
  communities: [ { id:'c1', name:'technology', members:2500, joined: true, desc:'Tech talk' }, { id:'c2', name:'gaming', members:1800, joined: false, desc:'Games & streams' }, { id:'c3', name:'cooking', members:840, joined: false, desc:'Recipes & tips' }],
  moods: ['Inspiring','Funny','Educational','Wholesome','Creative','Chill'],
  posts: [ { id:'p1', community:'technology', author:'techEnthusiast42', title:'The Future of AI in Software Development', body:'AI tools are reshaping how we write code. What do you think?', likes:3500, dislikes:20, comments:[{id:'cm1',author:'user2',text:'Great read!'}], createdAt: Date.now()-3600*1000*10 }, { id:'p2', community:'gaming', author:'PixelWarrior', title:'Hidden Gem Indie Game', body:'Just finished this indie game — highly recommend!', likes:16500, dislikes:120, comments:[], createdAt: Date.now()-3600*1000*24 } ],
  dailyChallenges: [ { id:'d1', title:'Community Contributor', progress:20, goal:100 }, { id:'d2', title:'Conversation Starter', progress:50, goal:100 }, { id:'d3', title:'Post 5 Comment', progress:0, goal:5 } ],
  polls: [ { id:'poll1', question:'What feature should we build next?', options:[ {id:'o1',text:'Dark Mode',votes:24}, {id:'o2',text:'Mobile App',votes:38}, {id:'o3',text:'AI Assistant',votes:15}, {id:'o4',text:'Advanced Search',votes:23} ], votedBy:[] } ]
}

export default function MainContent(){
  const [state, setState] = useState(initialState)
  const [filter, _setFilter] = useState({ search:'', mood:null })
  const [now, setNow] = useState(() => Date.now())

  useEffect(()=>{
    const id = setInterval(()=> setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  },[])

  useEffect(()=>{
    function loadExternal(){
      try{
        const raw = localStorage.getItem('connunity_communities');
        if (raw) setState(s => ({...s, communities: JSON.parse(raw)}));
        const ch = localStorage.getItem('connunity_challenges');
        if (ch) setState(s => ({...s, dailyChallenges: JSON.parse(ch)}));
        const ps = localStorage.getItem('connunity_posts');
        if (ps) setState(s => ({...s, posts: JSON.parse(ps)}));
      }catch(err){ console.warn('load external failed', err); }
    }
    loadExternal();
    function onStorage(e){ if (e.key === 'connunity_communities' || e.key === 'connunity_challenges' || e.key === 'connunity_posts'){ loadExternal(); } }
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[])

  function timeAgo(ts){ if (!ts) return ''; const s=Math.floor((now-ts)/1000); if (s<60) return s+'s'; if (s<3600) return Math.floor(s/60)+'m'; if (s<3600*24) return Math.floor(s/3600)+'h'; return Math.floor(s/(3600*24))+'d'; }

  const posts = (state.posts||[]).filter(p=>{
    const q = filter.search.toLowerCase(); if (q){ return (p.title||'').toLowerCase().includes(q) || (p.body||'').toLowerCase().includes(q) || (p.community||'').toLowerCase().includes(q); }
    return true;
  }).sort((a,b)=> (b.createdAt||0)-(a.createdAt||0));

  return (
    <div className="main-content-inner" style={{maxWidth:760}}>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontWeight:700}}>What's happening</div>
          <div className="muted">Quick filter</div>
        </div>
        <div className="mood-pill-container">
          <div className="mood-pill mood-inspiring"><span className="pill-icon">⚡</span> Inspiring</div>
          <div className="mood-pill mood-funny"><span className="pill-icon">😊</span> Funny</div>
          <div className="mood-pill mood-educational"><span className="pill-icon">📚</span> Educational</div>
          <div className="mood-pill mood-wholesome"><span className="pill-icon">🤍</span> Wholesome</div>
          <div className="mood-pill mood-creative"><span className="pill-icon">💡</span> Creative</div>
          <div className="mood-pill mood-chill"><span className="pill-icon">☕</span> Chill</div>
        </div>
      </div>

      {/* Poll card */}
      <div className="card">
        <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:10}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{opacity:0.9}}><path d="M3 13h4v8H3zM10 3h4v18h-4zM17 8h4v13h-4z" fill="#7c3aed"/></svg>
          <div style={{fontWeight:700}}>Community Poll</div>
        </div>
        <div className="muted-small" style={{marginBottom:8}}>What feature should we build next?</div>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          <button className="action-btn">Dark Mode</button>
          <button className="action-btn">Mobile App</button>
          <button className="action-btn">AI Assistant</button>
          <button className="action-btn">Advance Search</button>
        </div>
        <div style={{marginTop:12, textAlign:'center'}}>
          <button className="btn" style={{width:'100%', maxWidth:420}}>Submit vote</button>
        </div>
      </div>

      {/* Example post card (polished) */}
      <div className="post card">
        <div className="meta-top">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="avatar">T</div>
            <div>
              <div style={{fontSize:13, fontWeight:700}}>c/technology <span className="muted-small">· Posted by u/techEnthusiast42 3h ago</span></div>
            </div>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8}}>
            <div className="pill">Discussion</div>
          </div>
        </div>
        <div className="title">The Future of AI in Software Development: What We Can Expect in 2026</div>
        <div className="body">AI is revolutionizing how we write code. From intelligent code completion to preview automated testing, the tools available to developers are becoming increasingly sophisticated. What are your thoughts?</div>
        <img className="post-image" src="/demo-post-1.jpg" alt="post" />
        <div className="stats">
          <div className="stat">👍 3.5k</div>
          <div className="stat">💬 540</div>
          <div className="stat">🔗 Share</div>
          <div className="stat">💾 Save</div>
        </div>
      </div>

      <div style={{height:20}} />

      <div className="card">
        <div style={{fontWeight:700}}>Community Poll</div>
        <div className="muted">Polls disabled in demo</div>
      </div>

  <div className="posts" style={{marginTop:14}}>
        {posts.length===0 && <div className="card muted">No posts found.</div>}
        {posts.map(p=> (
          <div key={p.id} className="post card">
            <div className="meta-top">
              <div className="pill" style={{background:'#eef2ff',color:'#1e3a8a'}}>c/{p.community}</div>
              <div style={{color:'#6b7280'}}>{p.author}</div>
              <div className="muted">{timeAgo(p.createdAt)}</div>
            </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div className="title">{p.title}</div>
                <div>
                  <button className="action-btn" style={{borderRadius:999}}>⋯</button>
                </div>
              </div>
            <div className="body">{p.body}</div>
              {p.image ? (
                <img className="post-image" src={p.image} alt={p.title} onError={(e)=>{e.target.onerror=null; e.target.style.display='none'; const ph=e.target.nextSibling; if(ph) ph.style.display='block';}} />
              ) : null}
              <div className="post-image-fallback" style={{display: p.image ? 'none' : 'block'}}>
                <svg width="64" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="#eef2ff"/><path d="M3 15l4-5 3 4 5-6 6 8H3z" fill="#c7d2fe"/></svg>
              </div>
            <div className="stats">
              <div className="stat">👍 {p.likes?.toLocaleString()||0}</div>
              <div className="stat">💬 {(p.comments||[]).length.toLocaleString()}</div>
              <div className="stat">🔗 Share</div>
              <div className="stat">💾 Save</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
