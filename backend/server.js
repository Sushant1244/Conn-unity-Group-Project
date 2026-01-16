const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
})
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')))

// Mock register endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' })
  }
  // In a real app you'd validate, hash password, save to DB
  console.log('REGISTER', { username, email })
  return res.json({ success: true, message: 'Registered (mock)' })
})

// Mock login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' })
  // Accept any password for demo
  console.log('LOGIN', { email })
  return res.json({ success: true, token: 'mock-jwt-token' })
})

// Mock admin login with 2FA
app.post('/api/admin-login', (req, res) => {
  const { username, password, code } = req.body
  if (!username || !password || !code) return res.status(400).json({ success: false, message: 'Missing fields' })
  if (code !== '123456') {
    return res.status(401).json({ success: false, message: 'Invalid 2FA code (demo expects 123456)' })
  }
  console.log('ADMIN LOGIN', { username })
  return res.json({ success: true, token: 'mock-admin-token' })
})

// Fallback - serve index.html for any other route (static SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})

// --- Realtime Chat (Socket.IO) ---
// Track presence per room
const roomMembers = new Map() // room => Map<socketId, username>

function emitPresence(room) {
  const membersMap = roomMembers.get(room) || new Map()
  const members = Array.from(new Set(Array.from(membersMap.values())))
  io.to(room).emit('chat:presence', { room, members, count: members.length })
}

io.on('connection', (socket) => {
  // Join default room
  socket.join('general')
  socket.data.username = 'guest-' + socket.id.slice(0,4)
  // track in default room
  if (!roomMembers.has('general')) roomMembers.set('general', new Map())
  roomMembers.get('general').set(socket.id, socket.data.username)
  emitPresence('general')

  socket.on('chat:join', ({ room, username }) => {
    if (room) socket.join(room)
    if (username) socket.data.username = username
    socket.emit('chat:joined', { room: room || 'general', username: socket.data.username })
    if (room) {
      if (!roomMembers.has(room)) roomMembers.set(room, new Map())
      roomMembers.get(room).set(socket.id, socket.data.username)
      emitPresence(room)
    }
  })

  socket.on('chat:message', ({ room = 'general', text, username }) => {
    const msg = {
      id: Date.now() + Math.random(),
      room,
      text: String(text || '').slice(0, 1000),
      username: username || socket.data.username,
      ts: Date.now()
    }
    io.to(room).emit('chat:message', msg)
  })

  socket.on('chat:typing', ({ room = 'general', username }) => {
    socket.to(room).emit('chat:typing', { room, username: username || socket.data.username, ts: Date.now() })
  })

  socket.on('chat:set-username', ({ username }) => {
    if (username) socket.data.username = String(username).slice(0, 40)
    // update presence in all rooms this socket is in
    for (const room of socket.rooms) {
      if (room === socket.id) continue
      if (!roomMembers.has(room)) roomMembers.set(room, new Map())
      roomMembers.get(room).set(socket.id, socket.data.username)
      emitPresence(room)
    }
  })

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room === socket.id) continue
      const map = roomMembers.get(room)
      if (map) {
        map.delete(socket.id)
        emitPresence(room)
        if (map.size === 0) roomMembers.delete(room)
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Mock backend + Chat running on http://localhost:${PORT}`)
})
