import React, { useEffect, useMemo, useState } from 'react'

export default function UserProfileModal({ handle, onClose, onMessage }) {
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const h = (handle || '').replace(/^u\//,'')

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem('connunity.followers') || '[]')
      const g = JSON.parse(localStorage.getItem('connunity.following') || '[]')
      setFollowers(Array.isArray(f) ? f : [])
      setFollowing(Array.isArray(g) ? g : [])
    } catch {}
  }, [])

  const isFollowing = useMemo(() => following.includes(h), [following, h])

  const toggleFollow = () => {
    setFollowing(prev => {
      const next = prev.includes(h) ? prev.filter(x => x !== h) : [h, ...prev]
      try { localStorage.setItem('connunity.following', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const avatarUrl = (() => {
    try {
      const map = JSON.parse(localStorage.getItem('connunity.user.avatars') || '{}')
      return map[h] || null
    } catch { return null }
  })()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card user-modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-title" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span>Profile</span>
          <button className="link-btn" onClick={onClose}>Close</button>
        </div>
        <div className="modal-content">
          <div className="user-header">
            <div className="user-avatar" style={avatarUrl ? { backgroundImage:`url(${avatarUrl})`, backgroundSize:'cover', backgroundPosition:'center', color:'transparent' } : undefined}>
              {avatarUrl ? '' : (h?.[0] || 'U').toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-handle">@{h}</div>
              <div className="user-sub">Community Member</div>
              <div className="user-actions">
                <button className="btn btn-primary" onClick={() => onMessage && onMessage(h)}>Message</button>
                <button className="btn btn-secondary" onClick={toggleFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
              </div>
            </div>
          </div>
          <div className="user-stats">
            <div className="stat"><div className="num">{followers.includes(h) ? 1 : 0}</div><div className="lbl">Followers</div></div>
            <div className="stat"><div className="num">{isFollowing ? 1 : 0}</div><div className="lbl">Following</div></div>
          </div>
          <div className="user-section">
            <div className="user-section-title">About</div>
            <div className="user-about">This is @{h}'s profile. More details can be added later.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
