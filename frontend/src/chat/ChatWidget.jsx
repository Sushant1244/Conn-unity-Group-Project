import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const defaultRooms = ['general', 'random', 'announcements']

export default function ChatWidget({ open, onClose, username = 'You', initialRoom }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [activeRoom, setActiveRoom] = useState(initialRoom || 'general')
  const [rooms, setRooms] = useState(defaultRooms)
  const [people, setPeople] = useState([]) // handles
  const [typing, setTyping] = useState({}) // {room: username}
  const [unreads, setUnreads] = useState({}) // {room: count}
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('connunity.chat.history') || '{}') } catch { return {} }
  })
  const [presence, setPresence] = useState({}) // { room: { members:[], count:number } }
  const listRef = useRef(null)
  const typingRef = useRef(null)

  const messages = useMemo(() => history[activeRoom] || [], [history, activeRoom])

  useEffect(() => {
    if (!open) return
    // Prefer logged-in name from localStorage if available
    try {
      const me = JSON.parse(localStorage.getItem('connunity_current_user') || 'null')
      if (me?.username) username = me.username
    } catch {}

    // Load dynamic sources: joined communities and people
    try {
      const jc = JSON.parse(localStorage.getItem('connunity.joinedCommunities') || '[]')
      if (Array.isArray(jc) && jc.length) setRooms(prev => Array.from(new Set([...prev, ...jc.map(n => `c/${n}`)])))
    } catch {}
    try {
      const f = JSON.parse(localStorage.getItem('connunity.followers') || '[]')
      const g = JSON.parse(localStorage.getItem('connunity.following') || '[]')
      const unique = Array.from(new Set([...(Array.isArray(f)?f:[]), ...(Array.isArray(g)?g:[])]))
      setPeople(unique)
    } catch {}

    const s = io('http://localhost:4000', { transports: ['websocket', 'polling'] })
    setSocket(s)
    s.on('connect', () => {
      setConnected(true)
      s.emit('chat:join', { room: activeRoom, username })
      s.emit('chat:set-username', { username })
    })
    s.on('disconnect', () => setConnected(false))

    s.on('chat:joined', ({ room }) => {
      setActiveRoom(room || 'general')
    })

    s.on('chat:message', (msg) => {
      setHistory(prev => {
        const next = { ...prev, [msg.room]: [...(prev[msg.room] || []), msg] }
        try { localStorage.setItem('connunity.chat.history', JSON.stringify(next)) } catch {}
        return next
      })
      if (msg.room !== activeRoom) {
        setUnreads(prev => ({ ...prev, [msg.room]: (prev[msg.room] || 0) + 1 }))
      }
      // Autoscroll if viewing this room
      if (msg.room === activeRoom && listRef.current) {
        requestAnimationFrame(() => {
          listRef.current.scrollTop = listRef.current.scrollHeight
        })
      }
    })

    s.on('chat:typing', ({ room, username: who }) => {
      setTyping(prev => ({ ...prev, [room]: who }))
      clearTimeout(typingRef.current)
      typingRef.current = setTimeout(() => setTyping(prev => ({ ...prev, [room]: null })), 1200)
    })

    s.on('chat:presence', ({ room, members, count }) => {
      setPresence(prev => ({ ...prev, [room]: { members: members || [], count: count || 0 } }))
    })

    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [open])

  useEffect(() => {
    if (!socket || !open) return
    if (initialRoom) {
      setActiveRoom(initialRoom)
      socket.emit('chat:join', { room: initialRoom, username })
    }
  }, [initialRoom, open, socket])

  useEffect(() => {
    // Clear unreads when switching into a room
    setUnreads(prev => ({ ...prev, [activeRoom]: 0 }))
    // Snap scroll to bottom on room change
    if (listRef.current) {
      requestAnimationFrame(() => { listRef.current.scrollTop = listRef.current.scrollHeight })
    }
  }, [activeRoom])

  const send = () => {
    const text = input.trim()
    if (!text || !socket) return
    const msg = { room: activeRoom, text, username }
    // Optimistic render
    const local = { id: Date.now()+Math.random(), room: activeRoom, text, username, ts: Date.now(), self: true }
    setHistory(prev => {
      const next = { ...prev, [activeRoom]: [...(prev[activeRoom] || []), local] }
      try { localStorage.setItem('connunity.chat.history', JSON.stringify(next)) } catch {}
      return next
    })
    setInput('')
    socket.emit('chat:message', msg)
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); send(); return
    }
    // Typing indicator
    if (socket) socket.emit('chat:typing', { room: activeRoom, username })
  }

  const switchRoom = (r) => {
    setActiveRoom(r)
    if (socket) socket.emit('chat:join', { room: r, username })
  }

  if (!open) return null

  return (
    <div className="chat-drawer" onClick={(e)=>e.stopPropagation()}>
      <div className="chat-header">
        <div className="chat-title">💬 Chat</div>
        <div className="chat-roomname">#{activeRoom}</div>
        <div className="chat-presence">
          {(presence[activeRoom]?.members || []).slice(0,6).map((m, idx) => (
            <span key={m+idx} className="presence-chip" title={m}>{m.slice(0,1).toUpperCase()}</span>
          ))}
          {((presence[activeRoom]?.members || []).length > 6) && (
            <span className="presence-more">+{(presence[activeRoom].members.length - 6)}</span>
          )}
          <span className="presence-text">
            {presence[activeRoom]?.count ? `${presence[activeRoom].count} online` : '0 online'}
          </span>
        </div>
        <div className="chat-status">{connected ? 'Online' : 'Offline'}</div>
        <button className="chat-close" aria-label="Close chat" onClick={onClose}>✕</button>
      </div>
        <div className="chat-body">
        <div className="chat-rooms">
          <div className="chat-section-title">Rooms</div>
          {rooms.map(r => (
            <button key={r}
              className={`chat-room${activeRoom===r ? ' active' : ''}`}
              onClick={() => switchRoom(r)}
            >
              <span>{r.startsWith('c/') ? r : `#${r}`}</span>
              {presence[r]?.count ? <span className="chat-count">{presence[r].count}</span> : null}
              {!!(unreads[r]) && <span className="chat-unread">{unreads[r] > 9 ? '9+' : unreads[r]}</span>}
            </button>
          ))}
          <div className="chat-section-title" style={{marginTop:12}}>People</div>
          {people.length === 0 && (
            <div className="chat-empty">No followers yet</div>
          )}
          {people.map(h => (
            <button key={h}
              className={`chat-room${activeRoom===`dm:${h}` ? ' active' : ''}`}
              onClick={() => switchRoom(`dm:${h}`)}
            >
              <span>@{h}</span>
              {presence[`dm:${h}`]?.count ? <span className="chat-count">{presence[`dm:${h}`].count}</span> : null}
              {!!(unreads[`dm:${h}`]) && <span className="chat-unread">{unreads[`dm:${h}`] > 9 ? '9+' : unreads[`dm:${h}`]}</span>}
            </button>
          ))}
        </div>
        <div className="chat-main">
          <div className="chat-messages" ref={listRef}>
            {(messages || []).map(m => (
              <div key={m.id} className={`chat-row${(m.username===username || m.self) ? ' self' : ''}`}>
                <div className={`chat-bubble${(m.username===username || m.self) ? ' self' : ' other'}`}>
                  <div className="chat-meta">{m.username} • {new Date(m.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  <div className="chat-text">{m.text}</div>
                </div>
              </div>
            ))}
            {typing[activeRoom] && (
              <div className="chat-typing">
                <span>{typing[activeRoom]} is typing</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
              </div>
            )}
          </div>
          <div className="chat-input">
            <textarea
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary" onClick={send} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
