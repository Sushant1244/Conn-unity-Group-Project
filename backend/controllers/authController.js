const { addUser, findUserByEmail } = require('../services/store')

exports.register = (req, res) => {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' })
  }
  const existing = findUserByEmail(email)
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' })
  }
  const user = addUser({ username, email, password })
  return res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } })
}

exports.login = (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' })
  }
  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
  return res.json({ success: true, token: 'mock-jwt-token', user: { id: user.id, username: user.username, email: user.email } })
}
