import React, { useState, useEffect } from 'react'
import './App.css'
import { Header, CreatePostModal, AdminUsers, AdminCommunities, CommunityPoll, DailyChallenges, UserDashboard, ChangePassword } from './components'

function App(){
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [adminUsersOpen, setAdminUsersOpen] = useState(false)
  const [adminCommunitiesOpen, setAdminCommunitiesOpen] = useState(false)
  const [pollOpen, setPollOpen] = useState(false)
  const [challengesOpen, setChallengesOpen] = useState(false)
  const [userDashboardOpen, setUserDashboardOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('connunity_current_user')) || null } catch { return null }
  })

  // Listen for global UI events dispatched from small components
  useEffect(()=>{
    function onOpenCreatePost(){ setCreatePostOpen(true); }
    function onOpenPoll(){ setPollOpen(true) }
    function onOpenChallenges(){ setChallengesOpen(true) }
    function onOpenUserDashboard(){ setUserDashboardOpen(true) }
    function onOpenChangePassword(){ setChangePasswordOpen(true) }
    function onOpenAdminUsers(){ setAdminUsersOpen(true) }
    function onOpenAdminCommunities(){ setAdminCommunitiesOpen(true) }
    function onLogout(){ localStorage.removeItem('connunity_current_user'); setCurrentUser(null); }

    window.addEventListener('openCreatePost', onOpenCreatePost);
    window.addEventListener('openPoll', onOpenPoll);
    window.addEventListener('openChallenges', onOpenChallenges);
    window.addEventListener('openUserDashboard', onOpenUserDashboard);
    window.addEventListener('openChangePassword', onOpenChangePassword);
    window.addEventListener('openAdminUsers', onOpenAdminUsers);
    window.addEventListener('openAdminCommunities', onOpenAdminCommunities);
    window.addEventListener('connunityLogout', onLogout);

    return ()=>{
      window.removeEventListener('openCreatePost', onOpenCreatePost);
      window.removeEventListener('openPoll', onOpenPoll);
      window.removeEventListener('openChallenges', onOpenChallenges);
      window.removeEventListener('openUserDashboard', onOpenUserDashboard);
      window.removeEventListener('openChangePassword', onOpenChangePassword);
      window.removeEventListener('openAdminUsers', onOpenAdminUsers);
      window.removeEventListener('openAdminCommunities', onOpenAdminCommunities);
      window.removeEventListener('connunityLogout', onLogout);
    }
  },[])

  // URL param shortcuts (e.g. ?poll=1)
  useEffect(()=>{
    try{
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('poll') === '1') requestAnimationFrame(()=> setPollOpen(true));
      if (sp.get('challenges') === '1') requestAnimationFrame(()=> setChallengesOpen(true));
      if (sp.get('dashboard') === '1') requestAnimationFrame(()=> setUserDashboardOpen(true));
      if (sp.get('changePassword') === '1') requestAnimationFrame(()=> setChangePasswordOpen(true));
      if (sp.get('adminUsers') === '1') requestAnimationFrame(()=> setAdminUsersOpen(true));
      if (sp.get('adminCommunities') === '1') requestAnimationFrame(()=> setAdminCommunitiesOpen(true));
    }catch{ console.warn('open param parse failed') }
  },[])
  return (
    <div className="dashboard-root">
      <div className="container">
  <Header currentUser={currentUser} onOpenCreatePost={()=>setCreatePostOpen(true)} onLogout={()=>{ localStorage.removeItem('connunity_current_user'); setCurrentUser(null) }} />

        <main style={{padding:20}}>
          <div className="card">
            <h2>Welcome to Conn-unity</h2>
            <div className="muted">Use the header buttons to open Create Post, Community Poll, Daily Challenges, Dashboard, or Admin sections.</div>
          </div>
        </main>

  <CreatePostModal open={createPostOpen} onClose={()=>setCreatePostOpen(false)} />
  <AdminUsers open={adminUsersOpen} onClose={()=>setAdminUsersOpen(false)} />
  <AdminCommunities open={adminCommunitiesOpen} onClose={()=>setAdminCommunitiesOpen(false)} />
  <CommunityPoll open={pollOpen} onClose={()=>setPollOpen(false)} />
  <DailyChallenges open={challengesOpen} onClose={()=>setChallengesOpen(false)} />
  <UserDashboard open={userDashboardOpen} onClose={()=>setUserDashboardOpen(false)} />
  <ChangePassword open={changePasswordOpen} onClose={()=>setChangePasswordOpen(false)} />
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
