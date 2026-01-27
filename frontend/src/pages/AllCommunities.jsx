import React, { useMemo, useState } from 'react'

export default function AllCommunities({ communities, onClose, onJoin }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return communities
    return communities.filter((c) => c.name.toLowerCase().includes(q))
  }, [communities, query])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      <div style={{ width: '94vw', maxWidth: 880, maxHeight: '92vh', background: '#f2f6fb', border: '1px solid #d7deea', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '22px 26px', position: 'relative' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#121826' }}>All Communities</div>
          <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 20, top: 18, width: 36, height: 36, borderRadius: '50%', border: '1px solid #d1d7e0', background: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
          <div style={{ marginTop: 12, position: 'relative' }}>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search communities" style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: 22, border: '1px solid #d6dce6', background: '#d9e3f3', fontSize: 15, outline: 'none' }} />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>🔎</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px 24px' }}>
          {filtered.map((c, idx) => (
            <div key={`${c.name}-${idx}`} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.imageUrl ? `url(${c.imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#8b6dff,#7c5bff)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {c.imageUrl ? '' : (c.avatarText || c.name?.[0]?.toUpperCase() || 'C')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#111' }}>c/{c.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{String(c.members).includes('member') ? c.members : `${c.members} members`}</div>
              </div>
              <button
                onClick={() => !c.joined && onJoin && onJoin(c.name)}
                disabled={!!c.joined}
                style={{
                  background: c.joined ? '#e5e7eb' : '#fff',
                  border: '1.5px solid #e5e7eb',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontWeight: 700,
                  cursor: c.joined ? 'default' : 'pointer',
                  color: '#333'
                }}
              >
                {c.joined ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: 30 }}>No communities match your search.</div>
          )}
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid #e0e7f1', background: '#f6f8fb', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ borderRadius: 22, padding: '10px 18px', fontWeight: 700, background: '#e6edf7', border: '1px solid #cfd6df', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  )
}
