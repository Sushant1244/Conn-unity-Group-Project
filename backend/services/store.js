// Simple in-memory store for demo purposes
const db = {
  users: [
    { id: 1, username: 'Developer', email: 'developer@gmail.com', password: 'connunity@123', bio: 'Demo admin user' }
  ],
  communities: [
    { id: 1, name: 'general', description: 'General discussions' },
    { id: 2, name: 'random', description: 'Random talks' }
  ],
  posts: [
    { id: 1, communityId: 1, authorId: 1, title: 'Welcome!', content: 'Hello everyone 👋', ts: Date.now() }
  ]
}

function nextId(collection) {
  const arr = db[collection]
  return (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1
}

module.exports = {
  db,
  addUser(user) {
    const id = nextId('users')
    const u = { id, ...user }
    db.users.push(u)
    return u
  },
  findUserByEmail(email) {
    return db.users.find(u => u.email === email)
  },
  getUser(id) {
    return db.users.find(u => u.id === Number(id))
  },
  updateUser(id, patch) {
    const u = db.users.find(u => u.id === Number(id))
    if (!u) return null
    Object.assign(u, patch)
    return u
  },
  listCommunities() {
    return db.communities
  },
  addCommunity({ name, description }) {
    const id = nextId('communities')
    const c = { id, name, description }
    db.communities.push(c)
    return c
  },
  listPosts({ communityId }) {
    const cid = Number(communityId)
    return db.posts.filter(p => !communityId || p.communityId === cid)
  },
  addPost({ communityId, authorId, title, content }) {
    const id = nextId('posts')
    const p = { id, communityId: Number(communityId), authorId: Number(authorId), title, content, ts: Date.now() }
    db.posts.push(p)
    return p
  }
}
