import React, { useEffect, useRef, useState, useMemo } from 'react'
import { ArrowLeft, ShieldCheck, LayoutDashboard, Gavel, Users, Building2, FileText, BarChart3, Settings, UserCircle, MessageSquare, AlertTriangle, Check, X, UserMinus, UserPlus, Crown, Eye, EyeOff, Trash2, Clipboard, KeyRound, Edit3, Camera } from 'lucide-react'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import '../admin-dashboard.css'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend)

export default function AdminDashboard() {
  const lineRef = useRef(null)
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const analyticsRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('connunity_admin_theme') || 'light' } catch { return 'light' }
  })
  const [active, setActive] = useState('dashboard')
  const isDark = theme === 'dark'
  const [profile, setProfile] = useState({
    name: 'Admin User',
    handle: '@admin',
    email: 'admin@connunity.local',
    role: 'admin',
    bio: 'Responsible for keeping Conn-unity healthy and fun.',
    avatarUrl: '',
    apiKey: 'ak_live_' + Math.random().toString(36).slice(2,10) + Math.random().toString(36).slice(2,10),
    twoFAEnabled: true
  })
  const [showApi, setShowApi] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('connunity_admin_theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    if (active !== 'dashboard') return
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
  }, [active])

  useEffect(() => {
    if (active !== 'analytics') return
    if (!analyticsRef.current) return
    try {
      const ctx = analyticsRef.current.getContext('2d')
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          datasets: [
            { label: 'DAU', data: [12,14,13,16,18,19,21], borderColor: '#7dd3fc', backgroundColor: 'rgba(125,211,252,0.25)', fill: true, tension: 0.35 },
            { label: 'New Users', data: [3,4,3,5,6,6,7], borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.25)', fill: true, tension: 0.35 }
          ]
        },
        options: { responsive: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.05)' } }, y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } } } }
      })
      return () => chart.destroy()
    } catch (e) { console.error('Analytics chart error:', e) }
  }, [active])

  const Tab = ({ id, icon: Icon, label }) => (
    <li className={active === id ? 'active' : ''} onClick={() => setActive(id)} style={{ cursor: 'pointer' }}>
      <Icon size={16}/> <span>{label}</span>
    </li>
  )

  // Demo data for various panels
  const [queue, setQueue] = useState([
    { id: 1, community: 'c/technology', author: 'userA', reason: 'Spam links', status: 'pending' },
    { id: 2, community: 'c/gaming', author: 'player99', reason: 'Toxic behavior', status: 'pending' },
    { id: 3, community: 'c/nature', author: 'wanderer', reason: 'Off-topic', status: 'pending' }
  ])
  const [users, setUsers] = useState([
    { id: 1, name: 'Jane Doe', handle: '@jane', role: 'member', banned: false },
    { id: 2, name: 'Mark Lee', handle: '@mark', role: 'moderator', banned: false },
    { id: 3, name: 'Sam Green', handle: '@sam', role: 'member', banned: true }
  ])
  const [uQuery, setUQuery] = useState('')
  const filteredUsers = useMemo(() => users.filter(u => (u.name+u.handle).toLowerCase().includes(uQuery.toLowerCase())), [users, uQuery])
  const [communities, setCommunities] = useState([
    { id: 1, name: 'c/technology', members: '2.5M', visible: true },
    { id: 2, name: 'c/gaming', members: '1.6M', visible: true },
    { id: 3, name: 'c/nature', members: '1.2M', visible: false }
  ])
  const [newComm, setNewComm] = useState('')
  const [reports, setReports] = useState([
    { id: 10, type: 'Abuse', target: 'post #8421', community: 'c/technology', status: 'open' },
    { id: 11, type: 'Spam', target: 'comment #199', community: 'c/gaming', status: 'open' },
    { id: 12, type: 'Harassment', target: 'user @sam', community: 'c/nature', status: 'resolved' }
  ])

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
          <Tab id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <Tab id="moderation" icon={Gavel} label="Moderation" />
          <Tab id="users" icon={Users} label="Users" />
          <Tab id="communities" icon={Building2} label="Communities" />
          <Tab id="reports" icon={FileText} label="Reports" />
          <Tab id="analytics" icon={BarChart3} label="Analytics" />
          <Tab id="settings" icon={Settings} label="Settings" />
          <Tab id="profile" icon={UserCircle} label="Profile" />
        </ul>
      </nav>

      <main className="admin-main">
        {active === 'dashboard' && <>
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
        </>}

        {active === 'moderation' && (
          <section className="card">
            <div className="card-title">Moderation Queue</div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>ID</th><th>Community</th><th>Author</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {queue.map(item => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.community}</td>
                      <td>{item.author}</td>
                      <td>{item.reason}</td>
                      <td><span className={`badge ${item.status === 'pending' ? 'warning' : 'success'}`}>{item.status}</span></td>
                      <td className="row-actions">
                        <button className="btn-sm success" onClick={() => setQueue(q => q.map(i => i.id===item.id?{...i,status:'approved'}:i))}><Check size={14}/> Approve</button>
                        <button className="btn-sm danger" onClick={() => setQueue(q => q.filter(i => i.id!==item.id))}><X size={14}/> Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === 'users' && (
          <section className="card">
            <div className="card-title">Users</div>
            <div className="toolbar">
              <input value={uQuery} onChange={e=>setUQuery(e.target.value)} className="input" placeholder="Search users" />
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Handle</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.handle}</td>
                      <td>{u.role === 'moderator' ? <span className="badge info">moderator</span> : 'member'}</td>
                      <td>{u.banned ? <span className="badge danger">banned</span> : <span className="badge success">active</span>}</td>
                      <td className="row-actions">
                        <button className="btn-sm" onClick={()=>setUsers(list=>list.map(x=>x.id===u.id?{...x, role: x.role==='moderator'?'member':'moderator'}:x))}><Crown size={14}/> {u.role==='moderator'?'Remove Mod':'Make Mod'}</button>
                        {u.banned
                          ? <button className="btn-sm success" onClick={()=>setUsers(list=>list.map(x=>x.id===u.id?{...x,banned:false}:x))}><UserPlus size={14}/> Unban</button>
                          : <button className="btn-sm danger" onClick={()=>setUsers(list=>list.map(x=>x.id===u.id?{...x,banned:true}:x))}><UserMinus size={14}/> Ban</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === 'communities' && (
          <section className="card">
            <div className="card-title">Communities</div>
            <div className="toolbar">
              <input value={newComm} onChange={e=>setNewComm(e.target.value)} className="input" placeholder="Create new community (e.g., c/design)" />
              <button className="btn-sm success" disabled={!newComm.trim()} onClick={()=>{ setCommunities(prev=>[{ id: Date.now(), name:newComm.trim(), members:'0', visible:true }, ...prev]); setNewComm('') }}>Create</button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Members</th><th>Visibility</th><th>Actions</th></tr></thead>
                <tbody>
                  {communities.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.members}</td>
                      <td>{c.visible ? <span className="badge success">public</span> : <span className="badge warning">hidden</span>}</td>
                      <td className="row-actions">
                        <button className="btn-sm" onClick={()=>setCommunities(list=>list.map(x=>x.id===c.id?{...x,visible:!x.visible}:x))}>{c.visible? <EyeOff size={14}/> : <Eye size={14}/> } {c.visible? 'Hide':'Show'}</button>
                        <button className="btn-sm danger" onClick={()=>setCommunities(list=>list.filter(x=>x.id!==c.id))}><Trash2 size={14}/> Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === 'reports' && (
          <section className="card">
            <div className="card-title">Reports</div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>ID</th><th>Type</th><th>Target</th><th>Community</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.type}</td>
                      <td>{r.target}</td>
                      <td>{r.community}</td>
                      <td>{r.status === 'open' ? <span className="badge warning">open</span> : <span className="badge success">resolved</span>}</td>
                      <td className="row-actions">
                        {r.status === 'open' && <button className="btn-sm success" onClick={()=>setReports(list=>list.map(x=>x.id===r.id?{...x,status:'resolved'}:x))}><Check size={14}/> Resolve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === 'analytics' && (
          <section className="charts-row">
            <div className="card">
              <div className="card-title">Weekly Engagement</div>
              <canvas ref={analyticsRef} width={720} height={220}></canvas>
            </div>
            <div className="card">
              <div className="card-title">Highlights</div>
              <ul className="activity-list">
                <li><span className="check">✓</span> DAU up <strong>+8%</strong> WoW</li>
                <li><span className="check">✓</span> New user activation <strong>42%</strong></li>
                <li><span className="check">✓</span> Retention D7 <strong>28%</strong></li>
              </ul>
            </div>
          </section>
        )}

        {active === 'settings' && (
          <section className="card">
            <div className="card-title">Settings</div>
            <div className="toolbar">
              <button className="btn-sm" onClick={()=>setTheme(t=> t==='light'?'dark':'light')}>{theme==='light'?'Enable Dark Theme':'Disable Dark Theme'}</button>
              <button className="btn-sm danger" onClick={()=>{ localStorage.removeItem('connunity_admin_token'); window.location.href = '/auth.html#admin' }}>Logout Admin</button>
              <button className="btn-sm" onClick={()=>{ try { localStorage.setItem('connunity_admin_theme','light'); setTheme('light') } catch {} }}>Reset Theme</button>
            </div>
            <div className="muted">These settings are demo-only and affect the visuals of the admin panel.</div>
          </section>
        )}

        {active === 'profile' && (
          <section className="card">
            <div className="card-title">Admin Profile</div>
            <div className="profile-grid">
              <div>
                <div className="avatar-lg">
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt="avatar"/> : <UserCircle size={48}/>} 
                  <label className="avatar-upload" title="Upload avatar">
                    <Camera size={16}/>
                    <input type="file" accept="image/*" onChange={(e)=>{
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const url = URL.createObjectURL(f);
                      setProfile(p=>({...p, avatarUrl:url}))
                    }} />
                  </label>
                </div>
                <div className="muted" style={{marginTop:8}}>PNG/JPG up to 2MB</div>
              </div>
              <div>
                <div className="form-grid">
                  <label>
                    <span>Name</span>
                    <input className="input" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} />
                  </label>
                  <label>
                    <span>Handle</span>
                    <input className="input" value={profile.handle} onChange={e=>setProfile(p=>({...p,handle:e.target.value}))} />
                  </label>
                  <label>
                    <span>Email</span>
                    <input className="input" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} />
                  </label>
                  <label className="span-2">
                    <span>Bio</span>
                    <textarea className="input" rows={3} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} />
                  </label>
                </div>
                <div className="toolbar">
                  <button className="btn-sm"><Edit3 size={14}/> Save Changes</button>
                  <span className="badge info">Role: {profile.role}</span>
                </div>
              </div>
            </div>

            <div className="profile-panels">
              <div className="panel">
                <div className="panel-title"><KeyRound size={16}/> API Key</div>
                <div className="code-field">
                  <span>{showApi ? profile.apiKey : '••••••••••••••••••••••••••••'}</span>
                </div>
                <div className="toolbar">
                  <button className="btn-sm" onClick={()=>setShowApi(s=>!s)}>{showApi?'Hide':'Reveal'}</button>
                  <button className="btn-sm" onClick={()=>{ navigator.clipboard?.writeText(profile.apiKey) }}><Clipboard size={14}/> Copy</button>
                  <button className="btn-sm success" onClick={()=>setProfile(p=>({...p, apiKey:'ak_live_' + Math.random().toString(36).slice(2,10) + Math.random().toString(36).slice(2,10)}))}>Regenerate</button>
                  <button className="btn-sm" onClick={()=>{
                    const blob = new Blob([JSON.stringify(profile,null,2)],{type:'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'admin-profile.json'; a.click(); URL.revokeObjectURL(url);
                  }}>Download JSON</button>
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">Security</div>
                <div className="switch-row">
                  <label className="switch">
                    <input type="checkbox" checked={profile.twoFAEnabled} onChange={e=>setProfile(p=>({...p,twoFAEnabled:e.target.checked}))} />
                    <span className="slider"></span>
                  </label>
                  <span>Two‑Factor Authentication {profile.twoFAEnabled? '(enabled)':'(disabled)'} </span>
                </div>
                <ul className="activity-list" style={{marginTop:10}}>
                  <li><span className="check">✓</span> Last login <strong>today, 09:42</strong> from macOS</li>
                  <li><span className="check">✓</span> API key used <strong>2 times</strong> this week</li>
                  <li><span className="check">✓</span> Theme set to <strong>{theme}</strong></li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
