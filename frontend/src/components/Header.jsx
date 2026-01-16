import React from 'react'

export default function Header({ profile, currentUser, onOpenCreatePost, onLogout }){
  return (
    <header className="card header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div className="logo-wrapper" style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:48,height:48,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(90deg,#7c3aed,#ec4899)'}} aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 3-3 3-3-3 3-3z" fill="#fff" opacity="0.98"/><path d="M5 21h14v-6H5v6z" fill="#fff" opacity="0.06"/></svg>
          </div>
          <div>
            <div className="logo-text">Connunity</div>
            <div className="muted-small" style={{fontSize:11}}>Connect. Share. Discover.</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,display:'flex',justifyContent:'center'}} className="search-wrapper">
        <div style={{width:'60%'}}>
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <input placeholder="Search Conn-unity" className="search-input" />
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button className="icon-btn" title="Messages">💬</button>
        <button className="icon-btn" title="Notifications">🔔</button>
  <button className="btn" type="button" onClick={onOpenCreatePost}>Create Post</button>
  <button className="btn" type="button" onClick={()=> window.dispatchEvent(new CustomEvent('openPoll'))}>Community Poll</button>
  <button className="btn" type="button" onClick={()=> window.dispatchEvent(new CustomEvent('openChallenges'))}>Daily Challenges</button>
        {currentUser ? (
          <>
            <button className="action-btn" type="button" onClick={onLogout}>Logout</button>
            <button className="action-btn" type="button" onClick={()=> window.dispatchEvent(new CustomEvent('openUserDashboard'))} style={{marginLeft:8}}>Dashboard</button>
          </>
        ) : null}
  <button className="profile-pill" onClick={()=> window.dispatchEvent(new CustomEvent('openUserDashboard'))} type="button">
          <div className="avatar">{(profile && (profile.avatarLetter || (profile.name && profile.name[0]))) || 'D'}</div>
        </button>
      </div>
    </header>
  )
}
