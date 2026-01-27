import React from 'react'
import { createRoot } from 'react-dom/client'
import AdminDashboard from './pages/AdminDashboard'

function ensureRoot() {
  let el = document.getElementById('root')
  if (!el) {
    el = document.createElement('div')
    el.id = 'root'
    document.body.appendChild(el)
  }
  return el
}

function showMessage(message) {
  const el = ensureRoot()
  el.innerHTML = `<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: Inter, system-ui, -apple-system, Segoe UI; color: #333;">
    <div style="background:#fff; border:1px solid rgba(0,0,0,0.06); box-shadow:0 6px 24px rgba(0,0,0,0.08); border-radius:12px; padding:20px; max-width:520px; text-align:center;">
      <h2 style="margin:0 0 8px;">Admin Panel</h2>
      <p style="margin:0 0 12px;">${message}</p>
      <a href="/auth.html#admin" style="display:inline-block; padding:10px 14px; border-radius:8px; background:#07060a; color:#fff; text-decoration:none; font-weight:700;">Go to Admin Login →</a>
    </div>
  </div>`
}

function requireAdminAuth() {
  const token = localStorage.getItem('connunity_admin_token')
  if (!token) {
    // Render a helpful message instead of a silent blank redirect
    showMessage('Missing admin session. Please log in to continue.')
    return false
  }
  return true
}

function boot() {
  try {
    if (!requireAdminAuth()) return
    const root = createRoot(ensureRoot())

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error }
      }
      componentDidCatch(error, info) {
        console.error('AdminDashboard error:', error, info)
      }
      render() {
        if (this.state.hasError) {
          return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI', color: '#333' }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 6px 24px rgba(0,0,0,0.08)', borderRadius: 12, padding: 20, maxWidth: 520, textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 8px' }}>Admin Panel</h2>
                <p style={{ margin: '0 0 12px' }}>There was a problem loading the dashboard.</p>
                <a href="/auth.html#admin" style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 8, background: '#07060a', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Return to Admin Login →</a>
              </div>
            </div>
          )
        }
        return this.props.children
      }
    }

    root.render(
      <ErrorBoundary>
        <AdminDashboard />
      </ErrorBoundary>
    )
  } catch (e) {
    console.error('Admin boot error:', e)
    showMessage('An error occurred while loading the Admin Panel. Please reload or return to the Admin Login.')
  }
}

boot()
