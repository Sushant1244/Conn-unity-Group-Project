import React from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import VerifyOtp from './pages/VerifyOtp'

const mountRoot = () => {
  const rootEl = document.createElement('div')
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
  const root = createRoot(rootEl)

  function renderCurrent() {
    const hash = (window.location.hash || '#login').replace('#', '')
    if (hash === 'register') {
      root.render(<Register onLoginClick={() => { window.location.hash = '#login' }} />)
    } else if (hash === 'verify') {
      root.render(
        <VerifyOtp
          onBackToLogin={() => { window.location.hash = '#login' }}
          onBackToRegister={() => { window.location.hash = '#register' }}
        />
      )
    } else if (hash === 'admin') {
      root.render(<Admin onBack={() => { window.location.hash = '#login' }} />)
    } else {
      root.render(<Login onSignupClick={() => { window.location.hash = '#register' }} onAdminClick={() => { window.location.hash = '#admin' }} />)
    }
  }

  window.addEventListener('hashchange', renderCurrent)
  renderCurrent()
}

mountRoot()
