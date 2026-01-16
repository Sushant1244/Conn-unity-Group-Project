import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const defaultRooms = ['general', 'random', 'announcements']

export default function ChatWidget({ open, onClose, username = 'You' }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [activeRoom, setActiveRoom] = useState('general')
  const [rooms, setRooms] = useState(defaultRooms)
  const [typing, setTyping] = useState({}) // {room: username}
  const [unreads, setUnreads] = useState({}) // {room: count}
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('connunity.chat.history') || '{}') } catch { return {} }
  })
  const listRef = useRef(null)
  const typingRef = useRef(null)

  const messages = useMemo(() => history[activeRoom] || [], [history, activeRoom])

  useEffect(() => {
    if (!open) return
    const s = io('http://localhost:4000', { transports: ['websocket', 'polling'] })
    setSocket(s)
    s.on('connect', () => {
      setConnected(true)
      s.emit('chat:join', { room: activeRoom, username })
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

    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [open])

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

  if (!open) return null

  return (
    <div className="chat-drawer" onClick={(e)=>e.stopPropagation()}>
      <div className="chat-header">
        <div className="chat-title">💬 Chat</div>
        <div className="chat-status">{connected ? 'Online' : 'Offline'}</div>
        <button className="chat-close" aria-label="Close chat" onClick={onClose}>✕</button>
      </div>
      <div className="chat-body">
        <div className="chat-rooms">
          {rooms.map(r => (
            <button key={r}
              className={`chat-room${activeRoom===r ? ' active' : ''}`}
              onClick={() => setActiveRoom(r)}
            >
              <span>#{r}</span>
              {!!(unreads[r]) && <span className="chat-unread">{unreads[r] > 9 ? '9+' : unreads[r]}</span>}
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
