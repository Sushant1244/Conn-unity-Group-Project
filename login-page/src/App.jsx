import React, { useState } from 'react'
import Login from './components/Login.jsx'

export default function App(){
  const [open, setOpen] = useState(true)
  const [user, setUser] = useState(null)

  return (
    <div className="app-page">
      <header className="app-header">
        
        {user ? (
          <div className="user-info">
            <span>Signed in as {user.email}</span>
            <button className="btn" onClick={() => setUser(null)}>Sign out</button>
          </div>
        ) : null}
      </header>

      <Login
        open={open && !user}
        onClose={() => setOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </div>
  )
}
