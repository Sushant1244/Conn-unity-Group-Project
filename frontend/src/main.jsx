import React from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './Dashboard'
import './dashboard.css'

const rootEl = document.createElement('div')
rootEl.id = 'root'
document.body.appendChild(rootEl)

// Check if user has valid token before rendering dashboard
const token = localStorage.getItem('connunity_token')
if (!token) {
  window.location.href = '/index.html'
} else {
  createRoot(rootEl).render(<Dashboard />)
}
