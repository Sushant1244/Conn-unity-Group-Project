import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ShieldCheck, LayoutDashboard, Gavel, Users, Building2, FileText, BarChart3, Settings, UserCircle, MessageSquare, AlertTriangle } from 'lucide-react'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import '../admin-dashboard.css'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend)

export default function AdminDashboard() {
  const lineRef = useRef(null)
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('connunity_admin_theme') || 'light' } catch { return 'light' }
  })
  const isDark = theme === 'dark'

  useEffect(() => {
    try { localStorage.setItem('connunity_admin_theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    if (!lineRef.current || !barRef.current || !pieRef.current) return
    try {
    // Line Chart: User Growth
    const lctx = lineRef.current.getContext('2d')
    const lineChart = new Chart(lctx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          { label: 'Jan', data: [9000,12000,15000,19000,21000,20000,20500,21500,23000,24000,22000,19500], borderColor: '#f87171', backgroundColor: '#f87171', pointBackgroundColor: '#f87171', tension: 0.35 },
          { label: 'Feb', data: [3000,4200,6400,7800,9600,11000,12000,13000,14000,15000,16000,13500], borderColor: '#60a5fa', backgroundColor: '#60a5fa', pointBackgroundColor: '#60a5fa', tension: 0.35 },
          { label: 'Mar', data: [950,1500,2200,3000,4200,5800,7200,8600,9800,12000,13000,12200], borderColor: '#34d399', backgroundColor: '#34d399', pointBackgroundColor: '#34d399', tension: 0.35 },
        ]
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          x: { grid: { display: true, color: 'rgba(0,0,0,0.04)' } },
          y: { grid: { display: true, color: 'rgba(0,0,0,0.04)' }, beginAtZero: false }
        },
        elements: { point: { radius: 3 } }
      }
    })

    // Bar Chart: Weekly Content Activity
    const bctx = barRef.current.getContext('2d')
    const barChart = new Chart(bctx, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          { label: '2020', data: [30,45,40,60,50,80,70,65,55,75,60,85], backgroundColor: '#93c5fd' },
          { label: '2021', data: [50,70,60,80,75,85,90,88,75,95,85,98], backgroundColor: '#fca5a5' },
          { label: '2022', data: [65,85,78,95,90,100,98,92,88,102,98,105], backgroundColor: '#86efac' }
        ]
      },
      options: {
        responsive: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { stacked: false, grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } }
        }
      }
    })

    // Pie Chart: Community Distribution
    const pctx = pieRef.current.getContext('2d')
    const pieChart = new Chart(pctx, {
      type: 'pie',
      data: {
        labels: ['Gaming','Technology','Nature','Cooking','Other'],
        datasets: [{
          data: [31,25,15,26,3],
          backgroundColor: ['#8b5cf6','#22c55e','#60a5fa','#f59e0b','#9ca3af'],
          borderColor: '#fff', borderWidth: 2
        }]
      },
      options: { responsive: false, plugins: { legend: { display: false } } }
    })

    return () => { lineChart.destroy(); barChart.destroy(); pieChart.destroy() }
    } catch (err) {
      console.error('AdminDashboard charts error:', err)
    }
  }, [])

  return (
    <div className="admin-root" data-theme={theme}>
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="header-left" onClick={() => { window.location.href = '/' }} style={{ cursor: 'pointer' }}><ArrowLeft size={18} /> <span>Back to Site</span></div>
          <div className="header-center"><ShieldCheck size={18} /> <span>Admin Panel</span></div>
          <div className="header-right">
            <span style={{ marginRight: 10 }}>Welcome, admin</span>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                background: isDark ? '#1a1f28' : '#fff',
                color: isDark ? '#e5e7eb' : '#333',
                cursor: 'pointer',
                marginRight: 8
              }}
              aria-label="Toggle theme"
            >{theme === 'light' ? '🌙' : '☀️'} Theme</button>
            <button
              onClick={() => { localStorage.removeItem('connunity_admin_token'); window.location.href = '/auth.html#admin' }}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                background: isDark ? '#1a1f28' : '#fff',
                color: isDark ? '#e5e7eb' : '#333',
                cursor: 'pointer'
              }}
            >Logout</button>
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        <ul className="nav-list">
          <li className="active"><LayoutDashboard size={16}/> <span>Dashboard</span></li>
          <li><Gavel size={16}/> <span>Moderation</span></li>
          <li><Users size={16}/> <span>Users</span></li>
          <li><Building2 size={16}/> <span>Communities</span></li>
          <li><FileText size={16}/> <span>Reports</span></li>
          <li><BarChart3 size={16}/> <span>Analytics</span></li>
          <li><Settings size={16}/> <span>Settings</span></li>
        </ul>
      </nav>

      <main className="admin-main">
        {/* Stats row */}
        <section className="stats-row">
          <div className="stat-card">
            <div className="stat-head"><div className="icon-box blue"><UserCircle size={16}/></div><span>Total Users</span></div>
            <div className="stat-value">24,585</div>
            <div className="stat-badge">+12.5% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><div className="icon-box green"><LayoutDashboard size={16}/></div><span>Total Posts</span></div>
            <div className="stat-value">8,436</div>
            <div className="stat-badge">+8.5% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><div className="icon-box pink"><MessageSquare size={16}/></div><span>Comments</span></div>
            <div className="stat-value">45,821</div>
            <div className="stat-badge">+15.5% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-head"><div className="icon-box orange"><AlertTriangle size={16}/></div><span>Pending Reports</span></div>
            <div className="stat-value">23</div>
            <div className="stat-badge">+12.5% from last month</div>
          </div>
        </section>

        {/* Charts row */}
        <section className="charts-row">
          <div className="card">
            <div className="card-title">User Growth</div>
            <canvas ref={lineRef} width={340} height={180}></canvas>
            <div className="legend-inline"><span className="legend red">Jan</span><span className="legend blue">Feb</span><span className="legend green">Mar</span></div>
          </div>
          <div className="card">
            <div className="card-title">Weekly Content Activity</div>
            <canvas ref={barRef} width={340} height={180}></canvas>
            <div className="legend-inline"><span className="legend gray">2020</span><span className="legend red">2021</span><span className="legend green">2022</span></div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="bottom-row">
          <div className="card dist-card">
            <div className="card-title">Community Distribution</div>
            <div className="dist-content">
              <canvas ref={pieRef} width={220} height={220}></canvas>
              <div className="dist-legend">
                <div><span className="dot purple"></span> Gaming <span className="muted">168.13 20.11%</span></div>
                <div><span className="dot blue"></span> Technology <span className="muted">210 25.12%</span></div>
                <div><span className="dot green"></span> Nature <span className="muted">127.93 15.30%</span></div>
                <div><span className="dot orange"></span> Cooking <span className="muted">214.06 25.06%</span></div>
                <div><span className="dot gray"></span> Other <span className="muted">115.99 13.87%</span></div>
              </div>
            </div>
          </div>

          <div className="card activity-card">
            <div className="card-title">Recent Activity</div>
            <ul className="activity-list">
              <li><span className="check">✓</span> <strong>techEnthusiast42</strong> created a new post in <span className="comm">c/technology</span> <span className="time">2 mins ago</span></li>
              <li><span className="check">✓</span> <strong>moderator_jane</strong> removed a post in <span className="comm">c/gaming</span> <span className="time">5 mins ago</span></li>
              <li><span className="check">✓</span> <strong>newUser123</strong> joined <span className="comm">c/nature</span> <span className="time">8 mins ago</span></li>
              <li><span className="check">✓</span> <strong>ChefInTraining</strong> received a gold badge in <span className="comm">c/cooking</span> <span className="time">12 mins ago</span></li>
              <li><span className="check">✓</span> <strong>admin_system</strong> resolved a report in <span className="comm">c/technology</span> <span className="time">15 mins ago</span></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
