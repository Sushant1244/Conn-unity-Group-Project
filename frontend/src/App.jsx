import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SidebarProfile from './components/SidebarProfile'
import MainContent from './components/MainContent'
import CreatePostModal from './components/CreatePostModal'
import Profile from './components/Profile'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'
import Login from './components/Login'
import CreateCommunityModal from './components/CreateCommunityModal'
import CreateChallengeModal from './components/CreateChallengeModal'
import Register from './components/Register'

function App(){
  const [profileOpen, setProfileOpen] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('connunity_current_user')) || null } catch { return null }
  })

  // Listen for global UI events dispatched from small components (e.g., right-column buttons)
  useEffect(()=>{
    function onOpenCreatePost(){ setCreatePostOpen(true); }
    function onOpenCreateCommunity(){ setCommunityOpen(true); }
    function onLogout(){ localStorage.removeItem('connunity_current_user'); setCurrentUser(null); }
  function onOpenLogin(){ setLoginOpen(true); }
  function onOpenRegister(){ setRegisterOpen(true); }
  function onOpenAdmin(){ setAdminLoginOpen(true); }
    window.addEventListener('openCreatePost', onOpenCreatePost);
    window.addEventListener('openCreateCommunity', onOpenCreateCommunity);
  window.addEventListener('openLogin', onOpenLogin);
  window.addEventListener('openRegister', onOpenRegister);
    window.addEventListener('openAdmin', onOpenAdmin);
    window.addEventListener('connunityLogout', onLogout);
    return ()=>{
      window.removeEventListener('openCreatePost', onOpenCreatePost);
      window.removeEventListener('openCreateCommunity', onOpenCreateCommunity);
  window.removeEventListener('openLogin', onOpenLogin);
  window.removeEventListener('openRegister', onOpenRegister);
      window.removeEventListener('openAdmin', onOpenAdmin);
      window.removeEventListener('connunityLogout', onLogout);
    }
  },[])

  // open login modal via URL param: ?login=1
  useEffect(()=>{
    try{
      const sp = new URLSearchParams(window.location.search);
  if (sp.get('login') === '1') requestAnimationFrame(()=> setLoginOpen(true));
  if (sp.get('register') === '1') requestAnimationFrame(()=> setRegisterOpen(true));
  if (sp.get('admin') === '1') requestAnimationFrame(()=> setAdminLoginOpen(true));
  }catch{ console.warn('open login param parse failed') }
  },[])
  return (
    <div className="dashboard-root">
      <div className="container">
  <Header profile={currentUser} currentUser={currentUser} onOpenProfile={()=>setProfileOpen(true)} onOpenCreatePost={()=>setCreatePostOpen(true)} onOpenCreateCommunity={()=>setCommunityOpen(true)} onOpenCreateChallenge={()=>setChallengeOpen(true)} onOpenAdmin={()=>setAdminLoginOpen(true)} onOpenRegister={()=>setRegisterOpen(true)} onOpenLogin={()=>setLoginOpen(true)} onLogout={()=>{ localStorage.removeItem('connunity_current_user'); setCurrentUser(null) }} />

        <main style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20}}>
          <section>
            <MainContent />
          </section>
          <aside className="right-col">
            <SidebarProfile onOpenProfile={()=>setProfileOpen(true)} />
            <div className="card">
              <div style={{fontWeight:700,marginBottom:8}}>Popularity Community</div>
              <div className="community-list">Loading...</div>
            </div>
            <div className="card challenges">
              <div style={{fontWeight:700,marginBottom:8}}>Daily Challenges</div>
              <div></div>
            </div>
            <div className="card">
              <div style={{fontWeight:700,marginBottom:8}}>About Community</div>
              <div className="muted">A friendly place to share ideas, discover new communities and meet creators.</div>
            </div>
          </aside>
        </main>

  <CreatePostModal open={createPostOpen} onClose={()=>setCreatePostOpen(false)} />
  <AdminLogin open={adminLoginOpen} onClose={()=>setAdminLoginOpen(false)} onSuccess={()=>setAdminOpen(true)} />
  <AdminPanel open={adminOpen} onClose={()=>setAdminOpen(false)} />
  <Register open={registerOpen} onClose={()=>setRegisterOpen(false)} />
  <Login open={loginOpen} onClose={()=>setLoginOpen(false)} onSuccess={(user)=>{ try{ localStorage.setItem('connunity_current_user', JSON.stringify(user)) }catch(err){ console.warn('persist current user failed', err) } setCurrentUser(user) }} />
  <CreateCommunityModal open={communityOpen} onClose={()=>setCommunityOpen(false)} />
  <CreateChallengeModal open={challengeOpen} onClose={()=>setChallengeOpen(false)} />
  <Profile open={profileOpen} onClose={()=>setProfileOpen(false)} />
      </div>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>Conn-unity © {new Date().getFullYear()}. All rights reserved.</div>
          <div>
            <a href="#">About</a> • <a href="#">Help</a> • <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
