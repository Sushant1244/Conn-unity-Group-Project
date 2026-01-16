const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, 'data.json')
function readData(){ try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')) }catch(e){ return { posts:[], poll:{question:'Which feature should we build next?', options:[]}, challenges:[], users:[], communities:[] } }
}
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), 'utf8') }

const app = express()
app.use(cors())
app.use(bodyParser.json())

// POSTS
app.get('/api/posts', (req,res)=>{ const d=readData(); res.json(d.posts) })
app.post('/api/posts', (req,res)=>{ const d=readData(); const p = { id: 'p'+Date.now(), text: req.body.text||'', author: req.body.author||'Anonymous', created: new Date().toISOString() }; d.posts.unshift(p); writeData(d); res.json(p) })

// POLL
app.get('/api/poll', (req,res)=>{ const d=readData(); res.json(d.poll) })
app.post('/api/poll/vote', (req,res)=>{ const { optionId } = req.body; const d=readData(); const opt = d.poll.options.find(o=>o.id===optionId); if(!opt) return res.status(404).json({error:'option not found'}); opt.votes = (opt.votes||0)+1; writeData(d); res.json(d.poll) })

// CHALLENGES
app.get('/api/challenges', (req,res)=>{ const d=readData(); res.json(d.challenges) })
app.post('/api/challenges/complete', (req,res)=>{ const { challengeId, userId } = req.body; const d=readData(); const ch = d.challenges.find(c=>c.id===challengeId); if(!ch) return res.status(404).json({error:'challenge not found'}); ch.completedBy = ch.completedBy || []; if(!ch.completedBy.includes(userId)) ch.completedBy.push(userId); writeData(d); res.json(ch); })

// USERS
app.get('/api/users', (req,res)=>{ const d=readData(); res.json(d.users) })
app.post('/api/users', (req,res)=>{ const d=readData(); const u = { id: 'u'+Date.now(), name: req.body.name||'User', email: req.body.email||'', role: req.body.role||'member' }; d.users.push(u); writeData(d); res.json(u) })
app.put('/api/users/:id', (req,res)=>{ const d=readData(); const u = d.users.find(x=>x.id===req.params.id); if(!u) return res.status(404).json({error:'not found'}); Object.assign(u, req.body); writeData(d); res.json(u) })
app.delete('/api/users/:id', (req,res)=>{ const d=readData(); d.users = d.users.filter(x=>x.id!==req.params.id); writeData(d); res.json({ok:true}) })

// COMMUNITIES
app.get('/api/communities', (req,res)=>{ const d=readData(); res.json(d.communities) })
app.post('/api/communities', (req,res)=>{ const d=readData(); const c = { id: 'c'+Date.now(), name: req.body.name||'new', members: req.body.members||0, posts: req.body.posts||0, status: req.body.status||'Active', category: req.body.category||'General' }; d.communities.push(c); writeData(d); res.json(c) })
app.put('/api/communities/:id', (req,res)=>{ const d=readData(); const c = d.communities.find(x=>x.id===req.params.id); if(!c) return res.status(404).json({error:'not found'}); Object.assign(c, req.body); writeData(d); res.json(c) })
app.delete('/api/communities/:id', (req,res)=>{ const d=readData(); d.communities = d.communities.filter(x=>x.id!==req.params.id); writeData(d); res.json({ok:true}) })

// Change password (demo)
app.post('/api/users/:id/change-password', (req,res)=>{ // demo: store base64 in users.password (not secure)
  const { id } = req.params; const { current, next } = req.body; const d = readData(); const u = d.users.find(x=>x.id===id); if(!u) return res.status(404).json({error:'user not found'}); u.password = Buffer.from(next).toString('base64'); writeData(d); res.json({ok:true})
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('Backend listening on', PORT))
