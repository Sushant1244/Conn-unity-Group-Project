const { listCommunities, addCommunity } = require('../services/store')

exports.getCommunities = (req, res) => {
  res.json({ success: true, communities: listCommunities() })
}

exports.createCommunity = (req, res) => {
  const { name, description } = req.body || {}
  if (!name) return res.status(400).json({ success: false, message: 'Name required' })
  const c = addCommunity({ name, description: description || '' })
  res.json({ success: true, community: c })
}
