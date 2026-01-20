const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const { PORT, cors: corsCfg } = require('./config/config')

const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
})
// Port comes from config

app.use(cors(corsCfg))
app.use(bodyParser.json())

// Serve frontend static files (optional when deployed together)
app.use(express.static(path.join(__dirname, '..', 'frontend')))

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() })
})

// Modular routes
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/admin'))
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/communities'))
app.use('/api', require('./routes/posts'))
app.use('/api', require('./routes/dashboard'))
// API 404 handler
app.use(require('./middleware/notFound'))
// Global error handler
app.use(require('./middleware/errorHandler'))

// Fallback - serve index.html for any other route (handle errors gracefully)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'frontend', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) res.status(404).send('Not found')
  })
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
