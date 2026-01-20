const { listPosts, addPost } = require('../services/store')

exports.getPosts = (req, res) => {
  const { communityId } = req.query || {}
  res.json({ success: true, posts: listPosts({ communityId }) })
}

exports.createPost = (req, res) => {
  const { communityId, authorId, title, content } = req.body || {}
  if (!communityId || !authorId || !title || !content) {
    return res.status(400).json({ success: false, message: 'Missing fields' })
  }
  const p = addPost({ communityId, authorId, title, content })
  res.json({ success: true, post: p })
}
