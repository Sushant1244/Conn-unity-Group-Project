import React, { useEffect, useMemo, useRef, useState } from 'react'
import './dashboard.css'
import Createcommunity from './pages/Createcommunity'
import AllCommunities from './pages/AllCommunities'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import ChatWidget from './chat/ChatWidget'

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAllModal, setShowAllModal] = useState(false)
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [createPostOpts, setCreatePostOpts] = useState({ initialMood: null, autoOpenMedia: false })
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [popularCommunities, setPopularCommunities] = useState([
    { name: 'technology', members: '2.5M', avatarText: 'T' },
    { name: 'gaming', members: '1.6M', avatarText: 'G' },
    { name: 'nature', members: '1.2M', avatarText: 'N' },
    { name: 'cooking', members: '900K', avatarText: 'C' },
    { name: 'programming', members: '586K', avatarText: 'P' },
  ])

  const [toast, setToast] = useState({ visible: false, message: '' })
  const [avatarUrl, setAvatarUrl] = useState(null)
  // Poll state
  const pollOptions = ['Dark Mode', 'Mobile App', 'AI Assistant', 'Advance Search']
  const [pollSelected, setPollSelected] = useState(null)
  const [pollSubmitted, setPollSubmitted] = useState(false)
  const [pollCounts, setPollCounts] = useState([120, 98, 56, 34])
  const [originalVote, setOriginalVote] = useState(null)
    // Post interactions: votes, saved, comments
    const [interactions, setInteractions] = useState({}) // { [postId]: { vote: -1|0|1, saved: boolean, comments: string[] } }

  // Notifications
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState([]) // {id, type, text, postId?, read}
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

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
  const showToast = (message) => {
    setToast({ visible: true, message })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }

  const handleCreateCommunity = (payload) => {
    const slug = (payload.name || 'community')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'community'

    const newEntry = {
      name: slug,
      members: '1 member',
      avatarText: slug.charAt(0).toUpperCase(),
      imageUrl: payload.imageDataUrl || null,
    }
    setPopularCommunities((prev) => [newEntry, ...prev])
    setShowCreateModal(false)
    showToast(`c/${slug} created successfully`)
  }

  const [posts, setPosts] = useState([
    {
      id: 1,
      community: 'technology',
      category: 'NEWS',
      author: 'u/user@discord26',
      time: '2h',
      title: 'The Future of AI in Software Development: What We Can Expect in 2026',
      body: 'Artificial intelligence has been making huge strides. From intelligent code completion to advanced testing, the tools available to developers are becoming increasingly sophisticated. What are your thoughts on where this is heading?',
      mediaUrl: null,
      mediaType: null,
      likes: '3.5K', comments: '540'
    },
    {
      id: 2,
      community: 'gaming',
      category: 'GAME',
      author: 'u/PhilexWarrior',
      time: '1h',
      title: 'Just finished this indie game and WOW - hidden gem alert!',
      body: "I can't believe this indie title under the radar. The storytelling is phenomenal, the gameplay is tight, and the art style is absolutely gorgeous. If you're looking for something new to play, I'd heartily recommend checking this out.",
      mediaUrl: null,
      mediaType: null,
      likes: '16.5K', comments: '2.2K'
    }
  ])
  const POST_CHUNK = 3
  const [visibleCount, setVisibleCount] = useState(POST_CHUNK)
  const sentinelRef = useRef(null)
  const feedRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('connunity.avatarUrl')
    if (stored) setAvatarUrl(stored)
    try {
      const vote = localStorage.getItem('connunity.poll.vote')
      const counts = localStorage.getItem('connunity.poll.counts')
      if (counts) setPollCounts(JSON.parse(counts))
      if (vote !== null) {
        const v = Number(vote)
        setPollSelected(v)
        setOriginalVote(v)
        setPollSubmitted(true)
      }
      const i = localStorage.getItem('connunity.post.interactions')
      if (i) setInteractions(JSON.parse(i))
      const noti = localStorage.getItem('connunity.notifications')
      if (noti) setNotifications(JSON.parse(noti))
    } catch {}
  }, [])

  // Ensure interactions exist for all posts
  useEffect(() => {
    setInteractions((prev) => {
      const next = { ...prev }
      posts.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = { vote: 0, saved: false, comments: [] }
        }
      })
      return next
    })
  }, [posts])

  // Persist interactions
  useEffect(() => {
    try { localStorage.setItem('connunity.post.interactions', JSON.stringify(interactions)) } catch {}
  }, [interactions])

  // Persist notifications
  useEffect(() => {
    try { localStorage.setItem('connunity.notifications', JSON.stringify(notifications)) } catch {}
  }, [notifications])

  const pushNotif = (n) => {
    const item = { id: Date.now() + Math.random(), read: false, time: 'just now', ...n }
    setNotifications((prev) => [item, ...prev].slice(0, 80))
    setShowNotif(true)
  }
  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read: true})))
  const clearAllNotifs = () => setNotifications([])
  const openPostFromNotif = (postId) => {
    setShowProfile(false)
    setShowNotif(false)
    setTimeout(() => {
      const el = document.getElementById('post-' + postId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('pulse')
        setTimeout(() => el.classList.remove('pulse'), 900)
      }
    }, 50)
  }

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(POST_CHUNK)
  }, [searchQuery])

  // Incrementally reveal posts as the user scrolls (IntersectionObserver-based)
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        setVisibleCount((c) => Math.min(c + POST_CHUNK, posts.length))
      }
    }, { root: feedRef.current, rootMargin: '0px', threshold: 0.6 })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [posts.length])

  // Search filter across community, author, title, and body
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return posts
    const tokens = q.split(/[\s,]+/).filter(Boolean)
    if (!tokens.length) return posts
    return posts.filter((p) => {
      const hay = `${p.community} ${p.author} ${p.title} ${p.body}`.toLowerCase()
      return tokens.every((t) => hay.includes(t))
    })
  }, [posts, searchQuery])

  const handleCreatePost = (payload) => {
    const nowPost = {
      id: Date.now(),
      community: payload.community || 'general',
      author: 'you',
      time: 'just now',
      title: payload.title,
      body: payload.body,
      mediaUrl: payload.mediaUrl || null,
      mediaType: payload.mediaType || null,
      likes: '0', comments: '0'
    }
    setPosts((prev) => [nowPost, ...prev])
    setShowCreatePostModal(false)
    showToast('Post published successfully')
    setVisibleCount((c) => Math.max(2, c))

    // Simulated engagement notifications
    setTimeout(() => pushNotif({ type: 'like', text: `Alex liked your post "${payload.title}"`, postId: nowPost.id }), 1400)
    setTimeout(() => pushNotif({ type: 'comment', text: `Priya commented on your post "${payload.title}"`, postId: nowPost.id }), 2600)
  }

  const openCreatePostWithMood = (m) => {
    setCreatePostOpts({ initialMood: m, autoOpenMedia: true })
    setShowCreatePostModal(true)
  }

  const toggleUpvote = (id) => {
    setInteractions((prev) => {
      const cur = prev[id] || { vote: 0, saved: false, comments: [] }
      const vote = cur.vote === 1 ? 0 : 1
      return { ...prev, [id]: { ...cur, vote } }
    })
  }
  const toggleDownvote = (id) => {
    setInteractions((prev) => {
      const cur = prev[id] || { vote: 0, saved: false, comments: [] }
      const vote = cur.vote === -1 ? 0 : -1
      return { ...prev, [id]: { ...cur, vote } }
    })
  }
  const toggleSave = (id) => {
    setInteractions((prev) => {
      const cur = prev[id] || { vote: 0, saved: false, comments: [] }
      const saved = !cur.saved
      showToast(saved ? 'Saved' : 'Removed from saved')
      return { ...prev, [id]: { ...cur, saved } }
    })
  }
  const toggleComments = (id) => {
    setInteractions((prev) => {
      const cur = prev[id] || { vote: 0, saved: false, comments: [] }
      const show = !(cur.showComments)
      return { ...prev, [id]: { ...cur, showComments: show } }
    })
  }
  const addComment = (id, text) => {
    const t = text.trim()
    if (!t) return
    setInteractions((prev) => {
      const cur = prev[id] || { vote: 0, saved: false, comments: [] }
      const comments = [...(cur.comments || []), t]
      return { ...prev, [id]: { ...cur, comments } }
    })
    showToast('Comment added')
    // Simulated reply notification
    setTimeout(() => pushNotif({ type: 'reply', text: 'Someone replied to your comment', postId: id }), 1500)
  }
  const sharePost = (id, p) => {
    const url = window.location.origin + '/#post-' + id
    const payload = { title: p.title, text: p.title, url }
    if (navigator.share) {
      navigator.share(payload).catch(()=>{})
    } else {
      try { navigator.clipboard.writeText(url); showToast('Link copied') } catch { showToast(url) }
    }
  }

  const handleSubmitVote = () => {
    if (pollSelected === null) return
    const next = [...pollCounts]
    if (originalVote === null) {
      next[pollSelected] = (next[pollSelected] || 0) + 1
      setOriginalVote(pollSelected)
    } else if (originalVote !== pollSelected) {
      next[originalVote] = Math.max(0, (next[originalVote] || 0) - 1)
      next[pollSelected] = (next[pollSelected] || 0) + 1
      setOriginalVote(pollSelected)
    }
    setPollCounts(next)
    setPollSubmitted(true)
    localStorage.setItem('connunity.poll.vote', String(pollSelected))
    localStorage.setItem('connunity.poll.counts', JSON.stringify(next))
    showToast('Thanks for your vote!')
  }

  const handleJoin = (idx) => {
    setPopularCommunities((prev) => {
      const copy = [...prev]
      const c = { ...copy[idx], joined: true }
      copy[idx] = c
      return copy
    })
    const name = popularCommunities[idx]?.name || 'community'
    showToast(`Joined c/${name} successfully`)
    try {
      const raw = localStorage.getItem('connunity.joinedCommunities')
      const list = raw ? JSON.parse(raw) : []
      if (!list.includes(name)) {
        list.push(name)
        localStorage.setItem('connunity.joinedCommunities', JSON.stringify(list))
      }
    } catch {}
    setTimeout(() => pushNotif({ type: 'community', text: `New post in c/${name}: Welcome thread`, community: name }), 1200)
  }

  if (showProfile) {
    return (
      <Profile
        onBack={() => setShowProfile(false)}
        posts={posts}
        interactions={interactions}
        username="dipendraSah"
        onToggleSave={(id) => toggleSave(id)}
        onToggleUpvote={(id) => toggleUpvote(id)}
        onToggleDownvote={(id) => toggleDownvote(id)}
      />
    )
  }

  return (
    <div className="dashboard-root">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img src="/logo.jpeg" alt="Connunity Logo" className="brand-logo-img" />
            <div className="brand-text">Connunity</div>
          </div>
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search posts: topic, title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Open Chat" onClick={() => setShowChat(true)}>💬</button>
            <button className="icon-btn notif-btn" title="Notifications" onClick={() => setShowNotif((v) => !v)}>
              🔔
              {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            <button
              className="icon-btn"
              title="Create Post"
              aria-label="Create Post"
              onClick={() => { setCreatePostOpts({ initialMood: null, autoOpenMedia: false }); setShowCreatePostModal(true) }}
            >
              ➕
            </button>
            <button className="icon-btn" title="Profile" onClick={() => setShowProfile(true)}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="avatar-img" />
              ) : (
                '👤'
              )}
            </button>
            <button className="logout-btn" onClick={() => window.location.href = '/index.html'}>Logout</button>
            {showNotif && (
              <div className="notif-dropdown" onClick={(e)=>e.stopPropagation()}>
                <div className="notif-head">
                  <div className="notif-title">Notifications</div>
                  <div className="notif-actions">
                    <button className="link-btn" onClick={markAllRead}>Mark all read</button>
                    <button className="link-btn" onClick={clearAllNotifs}>Clear</button>
                  </div>
                </div>
                <div className="notif-list">
                  {notifications.length === 0 && (
                    <div className="notif-empty">You're all caught up</div>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`} onClick={() => {
                      setNotifications((prev)=> prev.map(x => x.id===n.id ? {...x, read:true} : x))
                      if (n.postId) openPostFromNotif(n.postId)
                    }}>
                      <div className="notif-icon">
                        {n.type === 'like' && '👍'}
                        {n.type === 'comment' && '💬'}
                        {n.type === 'reply' && '💬'}
                        {n.type === 'community' && '📰'}
                        {n.type === 'downvote' && '⬇️'}
                      </div>
                      <div className="notif-body">
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                      {!n.read && <span className="unread-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-grid">
        <section className="col col-mid" ref={feedRef}>
          <div className="card mood-card">
            <h4 className="card-title">What's your mood?</h4>
            <div className="tags">
              <button className="tag" onClick={() => openCreatePostWithMood('Inspiring')}>⚡ Inspiring</button>
              <button className="tag" onClick={() => openCreatePostWithMood('Funny')}>😄 Funny</button>
              <button className="tag" onClick={() => openCreatePostWithMood('Educational')}>📚 Educational</button>
              <button className="tag" onClick={() => openCreatePostWithMood('Wholesome')}>🎉 Wholesome</button>
              <button className="tag" onClick={() => openCreatePostWithMood('Creative')}>💎 Creative</button>
              <button className="tag" onClick={() => openCreatePostWithMood('Chill')}>🎯 Chill</button>
            </div>
          </div>

          <div className="card poll-card">
            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px'}}>
              <span style={{fontSize:'18px'}}>📊</span>
              <h4 className="card-title" style={{margin:0}}>Community Poll</h4>
            </div>
            <div style={{fontSize:'14px', fontWeight:600, marginBottom:'14px', color:'#333'}}>What feature should we build next?</div>

            {!pollSubmitted ? (
              <>
                {pollOptions.map((label, idx) => (
                  <div
                    key={label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={pollSelected === idx}
                    className={`poll-option${pollSelected === idx ? ' selected' : ''}`}
                    onClick={() => setPollSelected(idx)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPollSelected(idx) } }}
                  >{label}</div>
                ))}
                <button className="btn btn-primary" disabled={pollSelected === null} onClick={handleSubmitVote}>Submit vote</button>
              </>
            ) : (
              <>
                {(() => {
                  const total = pollCounts.reduce((a,b)=>a+b,0) || 1
                  return pollOptions.map((label, idx) => {
                    const pct = Math.round((pollCounts[idx] || 0) * 100 / total)
                    const you = pollSelected === idx
                    return (
                      <div key={label} className={`poll-result${you ? ' you' : ''}`}>
                        <div className="poll-result-top">
                          <span className="poll-label">{label}</span>
                          {you && <span className="you-badge">You</span>}
                          <span className="poll-pct">{pct}%</span>
                        </div>
                        <div className="poll-bar"><div className="poll-bar-fill" style={{width: pct + '%'}} /></div>
                      </div>
                    )
                  })
                })()}
                <div style={{marginTop:8, color:'#6b7280', fontSize:12}}>Total votes: {pollCounts.reduce((a,b)=>a+b,0)}</div>
                <div style={{display:'flex', justifyContent:'flex-start', marginTop:10}}>
                  <button
                    className="btn btn-secondary"
                    style={{width:'auto'}}
                    onClick={() => {
                      setPollSubmitted(false)
                      setPollSelected(null)
                      requestAnimationFrame(() => {
                        if (document && document.activeElement && document.activeElement.blur) {
                          document.activeElement.blur()
                        }
                      })
                    }}
                  >Back</button>
                </div>
              </>
            )}
          </div>

          {(searchQuery.trim() ? filteredPosts : posts.slice(0, visibleCount)).map((p, i) => {
            const key = p.id || i
            const inter = interactions[key] || { vote: 0, saved: false, comments: [], showComments: false }
            const baseLikes = parseCount(p.likes)
            const baseComments = parseCount(p.comments)
            const likesShown = fmtCount(baseLikes + (inter.vote === 1 ? 1 : inter.vote === -1 ? -1 : 0))
            const commentsShown = fmtCount(baseComments + (inter.comments?.length || 0))
            return (
            <div key={key} className="post-card" id={`post-${key}`}>
              <div className="post-header">
                <div className="comm-row">
                  <div className="comm-avatar" aria-hidden="true">
                    {(p.community?.[0] || 'C').toUpperCase()}
                  </div>
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
                  <button className="icon-btn-sm" aria-label="Upvote" onClick={() => toggleUpvote(key)}>
                    <svg className="icon icon-up" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4l6 6h-4v8H10V10H6l6-6z" />
                    </svg>
                  </button>
                  <span className="count">{likesShown}</span>
                  <button className="icon-btn-sm" aria-label="Downvote" onClick={() => toggleDownvote(key)}>
                    <svg className="icon icon-down" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20l-6-6h4V6h4v8h4l-6 6z" />
                    </svg>
                  </button>
                </div>

                <button className="pill comment-pill" onClick={() => toggleComments(key)}>
                  <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V6a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v9Z" />
                  </svg>
                  <span className="count">{commentsShown}</span>
                </button>

                <button className="pill share-pill" onClick={() => sharePost(key, p)}>
                  <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.59 13.51 15.42 17.49" />
                    <path d="M15.41 6.51 8.59 10.49" />
                  </svg>
                  <span className="label">Share</span>
                </button>

                <button className={`pill save-pill${inter.saved ? ' saved' : ''}`} onClick={() => toggleSave(key)}>
                  <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4h12v16l-6-4-6 4V4z" />
                  </svg>
                  <span className="label">{inter.saved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              {inter.showComments && (
                <div className="comments">
                  {(inter.comments || []).length === 0 ? (
                    <div className="comment-empty">Be the first to comment</div>
                  ) : (
                    (inter.comments || []).map((cmt, idx) => (
                      <div key={idx} className="comment-item">{cmt}</div>
                    ))
                  )}
                  <div className="comment-input">
                    <input className="search-input" placeholder="Write a comment..." onKeyDown={(e)=>{ if(e.key==='Enter'){ addComment(key, e.currentTarget.value); e.currentTarget.value=''; } }} />
                    <button className="btn btn-secondary" style={{width:'auto'}} onClick={(e)=>{ const inp=e.currentTarget.previousSibling; if(inp && inp.value) { addComment(key, inp.value); inp.value=''; } }}>Post</button>
                  </div>
                </div>
              )}
            </div>
          )})}
          {!searchQuery.trim() && visibleCount < posts.length && (
            <div ref={sentinelRef} style={{ height: 8 }} />
          )}
          {searchQuery.trim() && filteredPosts.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#6b7280', fontWeight: 600 }}>
              No results found for “{searchQuery}”. Try different keywords.
            </div>
          )}
        </section>

        <aside className="col col-right">
          <div className="card profile-card">
            <div className="profile-header">
              <div
                className="profile-large-avatar"
                style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}
              >
                {avatarUrl ? '' : 'D'}
              </div>
              <div className="profile-info">
                <div className="profile-h1">Dipendra Kumar Sah</div>
                <div className="profile-sub" style={{marginBottom:'4px'}}>Your personal Connunity homepage.</div>
                <div className="profile-sub">Come here to check in with your</div>
              </div>
            </div>
            <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => setShowCreatePostModal(true)}>Create Post</button>
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(true)}>Create Community</button>
            </div>
          </div>

          <div className="card popularity-card">
            <h4 className="card-title">Popularity Community</h4>
            <ol className="pop-list">
              {popularCommunities.map((c, idx) => (
                <li key={`${c.name}-${idx}`} className="pop-item">
                  <div className="pop-left">
                    <div className="pop-rank">{idx + 1}</div>
                    <div
                      className="pop-avatar"
                      style={c.imageUrl ? {
                        backgroundImage: `url(${c.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'transparent'
                      } : undefined}
                    >
                      {c.imageUrl ? '' : (c.avatarText || c.name?.[0]?.toUpperCase() || 'C')}
                    </div>
                  </div>
                  <div className="pop-body">
                    <div className="pop-name">c/{c.name}</div>
                    <div className="pop-sub">{String(c.members).includes('member') ? c.members : `${c.members} members`}</div>
                  </div>
                  <button
                    className={`pop-join${c.joined ? ' joined' : ''}`}
                    disabled={!!c.joined}
                    onClick={() => handleJoin(idx)}
                  >
                    {c.joined ? 'Joined' : 'Join'}
                  </button>
                </li>
              ))}
            </ol>
            <a className="view-all" href="#" onClick={(e)=>{e.preventDefault(); setShowAllModal(true)}}>View All Community</a>
          </div>

          <div className="card daily-card">
            <div className="daily-title"><span className="trophy">🏆</span> Daily Challenges</div>
            <div className="challenge-item">
              <div className="challenge-head"><div className="challenge-name">Community Contributor</div><div className="challenge-badge easy">Easy</div></div>
              <div className="challenge-desc">Post 5 quality comments today</div>
              <div className="progress"><div className="progress-fill" style={{width:'70%'}}></div></div>
              <div className="challenge-meta"><div className="time">8h left</div><div className="coins">100 coin</div></div>
            </div>

            <div className="challenge-item">
              <div className="challenge-head"><div className="challenge-name">Conversation Starter</div><div className="challenge-badge medium">Medium</div></div>
              <div className="challenge-desc">Start 5 Conversation today</div>
              <div className="progress"><div className="progress-fill" style={{width:'42%'}}></div></div>
              <div className="challenge-meta"><div className="time">3h left</div><div className="coins">250 coins</div></div>
            </div>

            <div className="challenge-item">
              <div className="challenge-head"><div className="challenge-name">Post 5 Comment</div><div className="challenge-badge medium">Medium</div></div>
              <div className="challenge-desc">Start 5 Comment today</div>
              <div className="progress"><div className="progress-fill" style={{width:'50%'}}></div></div>
              <div className="challenge-meta"><div className="time">2h left</div><div className="coins">250 coins</div></div>
            </div>
          </div>

          {/* About Community (placed under Daily Challenges) */}
          <div className="card about-card">
            <div className="about-title">About Community</div>
            <div className="about-desc">
              Welcome to Connunity! Share your thoughts, discover new communities,
              and engage with people who share your interests.
            </div>
            <div className="about-stats">
              <div className="stat-row">
                <div>Created</div>
                <div className="stat-num">Jan 2, 2025</div>
              </div>
              <div className="stat-row">
                <div>Members</div>
                <div className="stat-num">2.5M</div>
              </div>
              <div className="stat-row">
                <div>Online</div>
                <div className="stat-num online">• 42.6K</div>
              </div>
            </div>
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
      {showCreateModal && (
        <Createcommunity onClose={() => setShowCreateModal(false)} onCreate={handleCreateCommunity} />
      )}
      {showCreatePostModal && (
        <CreatePost
          onClose={() => setShowCreatePostModal(false)}
          onCreate={handleCreatePost}
          communities={popularCommunities.map(c=>c.name)}
          initialMood={createPostOpts.initialMood}
          autoOpenMedia={createPostOpts.autoOpenMedia}
        />
      )}
      {showAllModal && (
        <AllCommunities
          communities={popularCommunities}
          onClose={() => setShowAllModal(false)}
          onJoin={(name) => {
            setPopularCommunities((prev) => {
              const idx = prev.findIndex((c) => c.name === name)
              if (idx === -1) return prev
              const copy = [...prev]
              copy[idx] = { ...copy[idx], joined: true }
              return copy
            })
            showToast(`Joined c/${name} successfully`)
            try {
              const raw = localStorage.getItem('connunity.joinedCommunities')
              const list = raw ? JSON.parse(raw) : []
              if (!list.includes(name)) {
                list.push(name)
                localStorage.setItem('connunity.joinedCommunities', JSON.stringify(list))
              }
            } catch {}
          }}
        />
      )}

      {toast.visible && (
        <div style={{
          position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(17,24,39,0.95)', color: '#fff', padding: '10px 14px', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontWeight: 600, zIndex: 3000
        }}>
          {toast.message}
        </div>
      )}

      {/* Chat Widget */}
      {showChat && (
        <div onClick={() => setShowChat(false)} style={{ position:'fixed', inset:0, zIndex:4400, background:'transparent' }}>
          <ChatWidget open={showChat} onClose={() => setShowChat(false)} username="Dipendra" />
        </div>
      )}
    </div>
  )
}
