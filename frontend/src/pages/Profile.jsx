import React, { useEffect, useMemo, useState } from 'react'

export default function Profile({ onBack, posts = [], interactions = null, username = 'dipendraSah', onToggleSave, onToggleUpvote, onToggleDownvote }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [settingOpen, setSettingOpen] = useState(null) // 'profile' | 'curate' | 'avatar' | 'mod'
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [connectionsOpen, setConnectionsOpen] = useState(false)

  const tabs = ['Overview','Posts','Comments','Saved','History','Hidden','Upvoted','Downvoted']

  const userPosts = useMemo(() => posts.filter(p => String(p.author).toLowerCase() === 'you'), [posts])
  const [interState, setInterState] = useState(interactions || {})

  useEffect(() => {
    const stored = localStorage.getItem('connunity.avatarUrl')
    if (stored) setAvatarUrl(stored)
    // Load interactions if not provided
    try {
      if (!interactions) {
        const i = localStorage.getItem('connunity.post.interactions')
        if (i) setInterState(JSON.parse(i))
      }
      const f = localStorage.getItem('connunity.followers')
      const g = localStorage.getItem('connunity.following')
      if (f) setFollowers(JSON.parse(f))
      if (g) setFollowing(JSON.parse(g))
    } catch {}
  }, [interactions])

  // Keep local interState synced when prop changes
  useEffect(() => {
    if (interactions) setInterState(interactions)
  }, [interactions])

  // Persist followers/following
  useEffect(() => {
    try { localStorage.setItem('connunity.followers', JSON.stringify(followers)) } catch {}
  }, [followers])
  useEffect(() => {
    try { localStorage.setItem('connunity.following', JSON.stringify(following)) } catch {}
  }, [following])

  const toggleFollow = (handle) => {
    setFollowing((prev) => {
      const has = prev.includes(handle)
      return has ? prev.filter(h => h !== handle) : [handle, ...prev]
    })
    setToast({ visible: true, message: (following.includes(handle) ? 'Unfollowed ' : 'Following ') + handle })
    window.setTimeout(() => setToast({ visible: false, message: '' }), 1500)
  }

  const savedPosts = useMemo(() => {
    return posts.filter((p) => !!(interState && interState[p.id] && interState[p.id].saved))
  }, [posts, interState])

  const upvotedPosts = useMemo(() => {
    return posts.filter((p) => (interState && interState[p.id] && interState[p.id].vote === 1))
  }, [posts, interState])

  const downvotedPosts = useMemo(() => {
    return posts.filter((p) => (interState && interState[p.id] && interState[p.id].vote === -1))
  }, [posts, interState])

  const EmptyCard = ({ text }) => (
    <div className="card" style={{fontWeight:600, color:'#6b7280'}}>{text}</div>
  )

  const parseCount = (val) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    const s = String(val).trim().toUpperCase()
    if (s.endsWith('K')) return Math.round(parseFloat(s) * 1000)
    if (s.endsWith('M')) return Math.round(parseFloat(s) * 1000000)
    const n = parseInt(s, 10)
    return isNaN(n) ? 0 : n
  }
  const fmtCount = (n) => {
    if (n >= 1000000) return (Math.round(n / 100000) / 10) + 'M'
    if (n >= 1000) return (Math.round(n / 100) / 10) + 'K'
    return String(n)
  }

  const PostList = ({ items }) => (
    <>
      {items.map((p, i) => {
        const inter = interState[p.id] || { vote: 0, saved: false, comments: [] }
        const baseLikes = parseCount(p.likes)
        const baseComments = parseCount(p.comments)
        const likesShown = fmtCount(baseLikes + (inter.vote === 1 ? 1 : inter.vote === -1 ? -1 : 0))
        const commentsShown = fmtCount(baseComments + (inter.comments?.length || 0))
        return (
          <div key={i} className="post-card">
            <div className="post-header">
              <div className="comm-row">
                <div className="comm-avatar" aria-hidden="true">{(p.community?.[0] || 'C').toUpperCase()}</div>
                <div className="comm-name">c/{p.community}</div>
                <span className="dot">•</span>
                <div className="author">{p.author}</div>
                <span className="dot">•</span>
                <div className="time">{p.time} ago</div>
              </div>
              {p.category && (
                <div className={`category-tag ${p.category.toLowerCase()}`}>
                  {p.category === 'GAME' && <span className="tag-ico" aria-hidden="true">🎮</span>}
                  <span className="tag-text">{p.category}</span>
                </div>
              )}
            </div>
            <h3 className="post-title">{p.title}</h3>
            <p className="post-body">{p.body}</p>
            {p.mediaType === 'video' ? (
              <video className="post-media" src={p.mediaUrl} controls style={{ width: '100%', height: 220, borderRadius: 10, objectFit: 'cover' }} />
            ) : (
              <div
                className="post-media"
                style={p.mediaUrl ? { backgroundImage: `url(${p.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundImage: 'linear-gradient(135deg, rgba(75,46,255,0.1) 0%, rgba(168,122,255,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}
              />
            )}
            <div className="post-actions">
              <div className={`pill vote-pill${inter.vote===1 ? ' upvoted' : ''}${inter.vote===-1 ? ' downvoted' : ''}`}>
                <button className="icon-btn-sm" aria-label="Upvote" onClick={() => onToggleUpvote ? onToggleUpvote(p.id) : null}>
                  <svg className="icon icon-up" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4l6 6h-4v8H10V10H6l6-6z" />
                  </svg>
                </button>
                <span className="count">{likesShown}</span>
                <button className="icon-btn-sm" aria-label="Downvote" onClick={() => onToggleDownvote ? onToggleDownvote(p.id) : null}>
                  <svg className="icon icon-down" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20l-6-6h4V6h4v8h4l-6 6z" />
                  </svg>
                </button>
              </div>
              <button className="pill comment-pill" disabled>
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V6a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v9Z" />
                </svg>
                <span className="count">{commentsShown}</span>
              </button>
              <button className="pill share-pill">
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51 15.42 17.49" />
                  <path d="M15.41 6.51 8.59 10.49" />
                </svg>
                <span className="label">Share</span>
              </button>
              <button className={`pill save-pill${inter.saved ? ' saved' : ''}`} onClick={() => {
                if (onToggleSave) onToggleSave(p.id)
              }}>
                <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4h12v16l-6-4-6 4V4z" />
                </svg>
                <span className="label">{inter.saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        )
      })}
    </>
  )

  return (
    <div className="dashboard-root">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img src="/logo.jpeg" alt="Connunity Logo" className="brand-logo-img" />
            <div className="brand-text">Connunity</div>
          </div>
          <div style={{flex:1}} />
          <div className="top-actions">
            <button className="icon-btn" onClick={onBack}>←</button>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <section className="col col-mid">
          <div className="card" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
            <div
              className="profile-large-avatar"
              style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}
            >
              {avatarUrl ? '' : (username?.[0]?.toUpperCase() || 'U')}
            </div>
            <div style={{flex:1}}>
              <div className="profile-h1" style={{fontSize:20}}>{username}</div>
              <div className="profile-sub">u/{username}</div>
            </div>
            <div className="profile-counts" style={{display:'flex', alignItems:'center', gap:48}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:800, fontSize:16, color:'#111'}}>{followers.length}</div>
                <div style={{color:'#6b7280', fontSize:14}}>Followers</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:800, fontSize:16, color:'#111'}}>{following.length}</div>
                <div style={{color:'#6b7280', fontSize:14}}>Following</div>
              </div>
            </div>
          </div>

          <div className="card" style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {tabs.map(t => (
              <button
                key={t}
                className="tag"
                style={{padding:'8px 12px', borderRadius: 18, background: activeTab===t ? '#eef2ff' : '#f8f7ff', borderColor: activeTab===t ? 'rgba(91,63,255,0.25)' : 'rgba(91,63,255,0.1)'}}
                onClick={() => setActiveTab(t)}
              >{t}</button>
            ))}
          </div>

          <div className="card">
            {activeTab === 'Overview' && (
              <>
                <div style={{fontWeight:700, marginBottom:10}}>Showing all content</div>
                {userPosts.length > 0 ? (
                  <PostList items={userPosts} />
                ) : (
                  <EmptyCard text="No recent posts. Create one from Dashboard." />
                )}
              </>
            )}

            {activeTab === 'Posts' && (
              userPosts.length > 0 ? (
                <PostList items={userPosts} />
              ) : (
                <EmptyCard text="You haven't posted yet." />
              )
            )}

            {activeTab === 'Comments' && (
              <EmptyCard text="No comments yet." />
            )}

            {activeTab === 'Saved' && (
              savedPosts.length > 0 ? (
                <PostList items={savedPosts} />
              ) : (
                <EmptyCard text="No items in saved yet." />
              )
            )}

            {activeTab === 'History' && (
              <EmptyCard text="No browsing history yet." />
            )}

            {activeTab === 'Hidden' && (
              <EmptyCard text="No hidden items." />
            )}

            {activeTab === 'Upvoted' && (
              upvotedPosts.length > 0 ? (
                <PostList items={upvotedPosts} />
              ) : (
                <EmptyCard text="No upvoted items yet." />
              )
            )}

            {activeTab === 'Downvoted' && (
              downvotedPosts.length > 0 ? (
                <PostList items={downvotedPosts} />
              ) : (
                <EmptyCard text="No downvoted items yet." />
              )
            )}
          </div>
        </section>

        <aside className="col col-right">
          <div className="card" style={{padding:0, overflow:'hidden'}}>
            <div style={{background:'linear-gradient(180deg,#0a2a6a,#0b1730)', height:80}}></div>
            <div style={{padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div className="profile-h1">{username}</div>
                <button className="btn btn-secondary" style={{width:'auto'}}>Share</button>
              </div>
              <div className="about-stats" style={{paddingTop:10}}>
                <div className="stat-row"><div>Followers</div><div className="stat-num">0</div></div>
                <div className="stat-row"><div>Karma</div><div className="stat-num">1</div></div>
                <div className="stat-row"><div>Contributions</div><div className="stat-num">1</div></div>
                <div className="stat-row"><div>Reddit Age</div><div className="stat-num">1y</div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="about-title">Achievements</div>
            <div className="about-desc">Feed Finder, Newcomer, Joined Reddit, +3 more</div>
            <button className="btn btn-secondary" onClick={() => setAchievementsOpen(true)}>View All</button>
          </div>

          <div className="card">
            <div className="about-title">Connections</div>
            <div className="stat-row"><div>Followers</div><div className="stat-num">{followers.length}</div></div>
            <div className="stat-row"><div>Following</div><div className="stat-num">{following.length}</div></div>
            <button className="btn btn-secondary" style={{width:'auto'}} onClick={() => setConnectionsOpen(true)}>Manage</button>
          </div>

          <div className="card">
            <div className="about-title">Settings</div>
            <div className="stat-row"><div>Profile</div><button className="btn btn-secondary" style={{width:'auto'}} onClick={() => setSettingOpen('profile')}>Update</button></div>
            <div className="stat-row"><div>Curate your profile</div><button className="btn btn-secondary" style={{width:'auto'}} onClick={() => setSettingOpen('curate')}>Update</button></div>
            <div className="stat-row"><div>Avatar</div><button className="btn btn-secondary" style={{width:'auto'}} onClick={() => setSettingOpen('avatar')}>Update</button></div>
            <div className="stat-row"><div>Mod Tools</div><button className="btn btn-secondary" style={{width:'auto'}} onClick={() => setSettingOpen('mod')}>Update</button></div>
          </div>
        </aside>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-content">
            <div className="footer-brand">Conn-unity</div>
            <div className="footer-copyright">Community Inc © 2025. All rights reserved</div>
            <div className="footer-links">About • Help • Privacy • Term</div>
          </div>
        </div>
      </footer>

      {achievementsOpen && (
        <div className="modal-backdrop" onClick={() => setAchievementsOpen(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-title">Your Achievements</div>
            <div className="modal-content">
              <ul style={{margin:0, paddingLeft:18, color:'#374151'}}>
                <li>Feed Finder</li>
                <li>Newcomer</li>
                <li>Joined Connunity</li>
                <li>Helpful Commenter</li>
                <li>Conversation Starter</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setAchievementsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {connectionsOpen && (
        <div className="modal-backdrop" onClick={() => setConnectionsOpen(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-title">Manage Connections</div>
            <div className="modal-content" style={{display:'grid', gap:12}}>
              <div style={{fontWeight:700, color:'#111'}}>Suggestions</div>
              {[
                { handle: 'alex', name: 'Alex' },
                { handle: 'priya', name: 'Priya' },
                { handle: 'arjun', name: 'Arjun' },
                { handle: 'mira', name: 'Mira' },
              ].map(u => (
                <div key={u.handle} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div className="profile-large-avatar" style={{width:36, height:36, fontSize:16}}>{u.name[0]}</div>
                    <div>
                      <div style={{fontWeight:700, color:'#111'}}>{u.name}</div>
                      <div style={{fontSize:12, color:'#9ca3af'}}>u/{u.handle}</div>
                    </div>
                  </div>
                  <button className="btn btn-secondary" style={{width:'auto'}} onClick={() => toggleFollow(u.handle)}>
                    {following.includes(u.handle) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}

              <div style={{marginTop:8, fontWeight:700, color:'#111'}}>Following</div>
              {following.length === 0 ? (
                <div style={{color:'#6b7280', fontWeight:600}}>You're not following anyone yet.</div>
              ) : (
                following.map(h => (
                  <div key={h} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div className="profile-large-avatar" style={{width:28, height:28, fontSize:14}}>{h[0].toUpperCase()}</div>
                      <div style={{fontSize:13, color:'#374151'}}>u/{h}</div>
                    </div>
                    <button className="btn btn-secondary" style={{width:'auto'}} onClick={() => toggleFollow(h)}>Unfollow</button>
                  </div>
                ))
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConnectionsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {!!settingOpen && (
        <div className="modal-backdrop" onClick={() => setSettingOpen(null)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-title">
              {settingOpen === 'profile' && 'Update Profile'}
              {settingOpen === 'curate' && 'Curate Your Profile'}
              {settingOpen === 'avatar' && 'Update Avatar'}
              {settingOpen === 'mod' && 'Mod Tools'}
            </div>
            <div className="modal-content" style={{display:'grid', gap:12}}>
              {settingOpen === 'profile' && (
                <>
                  <label style={{fontWeight:600}}>Display Name</label>
                  <input className="search-input" placeholder="Enter display name" defaultValue={username} />
                </>
              )}
              {settingOpen === 'curate' && (
                <>
                  <label style={{fontWeight:600}}>Bio</label>
                  <textarea className="search-input" style={{height:80, paddingTop:10}} placeholder="Write a short bio" />
                </>
              )}
              {settingOpen === 'avatar' && (
                <>
                  <label style={{fontWeight:600}}>Upload Avatar</label>
                  <input type="file" accept="image/*" onChange={(e)=> setAvatarFile(e.target.files?.[0] || null)} />
                  {avatarFile && (
                    <div style={{marginTop:10, display:'flex', alignItems:'center', gap:12}}>
                      <div style={{width:48, height:48, borderRadius:'50%', backgroundImage:`url(${URL.createObjectURL(avatarFile)})`, backgroundSize:'cover', backgroundPosition:'center'}} />
                      <div style={{fontSize:12, color:'#6b7280'}}>{avatarFile.name}</div>
                    </div>
                  )}
                </>
              )}
              {settingOpen === 'mod' && (
                <div style={{color:'#6b7280'}}>Basic moderation tools coming soon.</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSettingOpen(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (settingOpen === 'avatar' && avatarFile) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      const url = String(reader.result)
                      setAvatarUrl(url)
                      localStorage.setItem('connunity.avatarUrl', url)
                      setSettingOpen(null)
                      setAvatarFile(null)
                      setToast({ visible: true, message: 'Avatar updated' })
                      window.setTimeout(() => setToast({ visible: false, message: '' }), 1800)
                    }
                    reader.readAsDataURL(avatarFile)
                  } else {
                    setSettingOpen(null)
                    setToast({ visible: true, message: 'Saved successfully' })
                    window.setTimeout(() => setToast({ visible: false, message: '' }), 1800)
                  }
                }}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {toast.visible && (
        <div style={{
          position:'fixed', bottom:22, left:'50%', transform:'translateX(-50%)',
          background:'rgba(17,24,39,0.95)', color:'#fff', padding:'10px 14px', borderRadius:10,
          boxShadow:'0 8px 24px rgba(0,0,0,0.2)', fontWeight:600, zIndex: 5000
        }}>{toast.message}</div>
      )}
    </div>
  )
}
