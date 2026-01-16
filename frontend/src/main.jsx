import React from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './Dashboard'
import './dashboard.css'

const rootEl = document.createElement('div')
rootEl.id = 'root'
document.body.appendChild(rootEl)

createRoot(rootEl).render(<Dashboard />)
