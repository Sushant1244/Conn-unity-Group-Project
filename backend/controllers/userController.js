const { db, getUser, updateUser } = require('../services/store')

exports.getProfile = (req, res) => {
  const user = db.users[0]
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, bio: user.bio || '' } })
}

exports.updateProfile = (req, res) => {
  const { username, bio } = req.body || {}
  const user = db.users[0]
  const updated = updateUser(user.id, { username: username || user.username, bio: bio ?? user.bio })
  res.json({ success: true, user: { id: updated.id, username: updated.username, email: updated.email, bio: updated.bio || '' } })
}

exports.getUserById = (req, res) => {
  const user = getUser(req.params.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, bio: user.bio || '' } })
}
