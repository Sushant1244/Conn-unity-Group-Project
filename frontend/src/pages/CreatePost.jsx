import React, { useEffect, useRef, useState } from 'react'

export default function CreatePost({ onClose, onCreate, communities = [], initialMood = null, autoOpenMedia = false }) {
  const [community, setCommunity] = useState(communities[0] || 'general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'image' | 'video'
  const [tag, setTag] = useState('Discussion')
  const [mood, setMood] = useState(initialMood)
  const fileInputRef = useRef(null)

  const canPublish = title.trim().length > 0 && body.trim().length > 0

  const tags = ['Discussion', 'Question', 'Showcase', 'News', 'Guide']
  const moods = ['Inspiring','Funny','Educational','Wholesome','Creative','Chill']

  useEffect(() => {
    // Auto-open file picker when requested
    if (autoOpenMedia && fileInputRef.current) {
      // delay slightly to allow modal render
      const t = setTimeout(() => fileInputRef.current.click(), 200)
      return () => clearTimeout(t)
    }
  }, [autoOpenMedia])

  const publish = () => {
    if (!canPublish) return
    onCreate && onCreate({ community, title: title.trim(), body: body.trim(), mediaUrl, mediaType, tag, mood })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
      <div style={{ width: '94vw', maxWidth: 960, maxHeight: '92vh', background: '#f2f6fb', borderRadius: 18, border: '1px solid #d7deea', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 26px', position: 'relative' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#121826' }}>Create Post</div>
          <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 20, top: 18, width: 36, height: 36, borderRadius: '50%', border: '1px solid #d1d7e0', background: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '0 26px 18px 26px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <select value={community} onChange={(e)=>setCommunity(e.target.value)} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid #d1d7e0', background: '#d9e3f3', fontWeight: 600 }}>
                {communities.map((c)=> <option key={c} value={c}>c/{c}</option>)}
              </select>
              <select value={tag} onChange={(e)=>setTag(e.target.value)} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid #d1d7e0', background: '#e6ebf4', fontWeight: 600 }}>
                {tags.map((t)=> <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Title"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #d1d7e0', background: '#d9e3f3', fontSize: 18, fontWeight: 700, marginBottom: 12, outline: 'none' }}
            />

            <textarea
              value={body}
              onChange={(e)=>setBody(e.target.value)}
              rows={8}
              placeholder="Share your thoughts..."
              style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid #d1d7e0', background: '#d9e3f3', fontSize: 15, outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label htmlFor="post-media-input" style={{ display: 'block', cursor: 'pointer', marginBottom: 8, fontWeight: 700, color: '#111' }}>Media</label>
            <div
              title="Add media"
              onClick={()=>fileInputRef.current && fileInputRef.current.click()}
              style={{ height: 220, borderRadius: 12, border: '1px solid #d1d7e0', background: !mediaUrl ? 'linear-gradient(180deg,#f0f4ff,#dfe7ff)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', cursor: 'pointer', overflow: 'hidden' }}
            >
              {!mediaUrl && 'Click to upload'}
              {mediaUrl && mediaType === 'image' && (
                <div style={{ width: '100%', height: '100%', background: `url(${mediaUrl}) center/cover no-repeat` }} />
              )}
              {mediaUrl && mediaType === 'video' && (
                <video src={mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <input
              ref={fileInputRef}
              id="post-media-input"
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={(e)=>{
                const f = e.target.files && e.target.files[0]
                if (!f) return
                if (f.type && f.type.startsWith('video')) {
                  setMediaType('video')
                  const url = URL.createObjectURL(f)
                  setMediaUrl(url)
                } else {
                  setMediaType('image')
                  const r = new FileReader()
                  r.onload = () => setMediaUrl(r.result)
                  r.readAsDataURL(f)
                }
              }}
            />
          </div>
        </div>

        <div style={{ padding: '12px 24px', borderTop: '1px solid #e0e7f1', background: '#f6f8fb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {moods.map((m)=>{
              const selected = mood === m
              const labelIcon = {
                Inspiring: '⚡', Funny: '😄', Educational: '📚', Wholesome: '🎉', Creative: '💎', Chill: '🎯'
              }[m]
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(selected ? null : m)}
                  style={{
                    padding:'10px 16px', borderRadius:22,
                    border: selected ? '1.5px solid #5b3fff' : '1px solid rgba(91,63,255,0.15)',
                    background: selected ? '#ede8ff' : '#f8f7ff',
                    color:'#5b3fff', fontWeight:700, fontSize:13, cursor:'pointer'
                  }}
                >
                  {labelIcon} {m}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 22, border: '1px solid #cfd6df', background: '#e6edf7', fontWeight: 700 }}>Cancel</button>
            <button onClick={publish} disabled={!canPublish} style={{ padding: '10px 18px', borderRadius: 22, border: 'none', background: canPublish ? '#2563eb' : '#d0d7e2', color: '#fff', fontWeight: 800, cursor: canPublish ? 'pointer' : 'not-allowed', boxShadow: canPublish ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>Publish</button>
          </div>
        </div>
      </div>
    </div>
  )
}
