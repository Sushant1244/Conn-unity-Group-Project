exports.adminLogin = (req, res) => {
  const { username, password, code } = req.body || {}
  const expectedEmail = 'developer@gmail.com'
  const expectedPassword = 'connunity@123'
  const expectedCode = '99390D'

  const okEmail = String(username || '').trim().toLowerCase() === expectedEmail
  const okPassword = String(password || '') === expectedPassword
  const okCode = String(code || '').toUpperCase() === expectedCode

  if (!okEmail || !okPassword || !okCode) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials or code' })
  }
  return res.json({ success: true, token: 'mock-admin-token' })
}

exports.adminDashboard = (req, res) => {
  res.json({
    success: true,
    stats: {
      users: 1,
      communities: 2,
      posts: 1,
      activeRooms: ['general', 'random']
    }
  })
}
