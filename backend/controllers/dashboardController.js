const { db } = require('../services/store')

exports.getDashboard = (req, res) => {
  const me = db.users[0]
  const communities = db.communities
  const posts = db.posts

  const stats = {
    users: db.users.length,
    communities: communities.length,
    posts: posts.length
  }

  // Build a lightweight feed snapshot (last 10)
  const feed = posts
    .slice(-10)
    .reverse()
    .map(p => ({
      id: p.id,
      communityId: p.communityId,
      authorId: p.authorId,
      title: p.title,
      content: p.content,
      ts: p.ts
    }))

  res.json({
    success: true,
    user: { id: me.id, username: me.username, email: me.email, bio: me.bio || '' },
    stats,
    communities,
    feed
  })
}
