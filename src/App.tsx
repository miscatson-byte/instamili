import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Reels from './pages/Reels'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'

// Guest user mock data — bina login ke dashboard dikhega
const GUEST_USER = {
  id: 'guest-user-id',
  email: 'guest@instamili.com',
  user_metadata: { username: 'guest_user', full_name: 'Guest User' }
}

const GUEST_PROFILE = {
  id: 'guest-user-id',
  username: 'guest_user',
  full_name: 'Guest User',
  email: 'guest@instamili.com',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  bio: 'Welcome to Instamili! 👋',
  followers: 0,
  following: 0,
  created_at: new Date().toISOString()
}

function App() {
  const { setUser, setProfile } = useAuthStore()

  useEffect(() => {
    // Check real session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        // No session? Set guest user — bina login ke app chalega
        setUser(GUEST_USER)
        setProfile(GUEST_PROFILE)
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Main app — always accessible, no login required */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="reels" element={<Reels />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App