import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Settings, Grid, Bookmark, User } from 'lucide-react'

export default function Profile() {
  const { username } = useParams()
  const { profile: currentUserProfile, user } = useAuthStore()
  
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    setLoading(true)
    
    let query = supabase.from('users').select('*')
    
    if (username) {
      query = query.eq('username', username)
    } else {
      query = query.eq('id', user?.id)
    }
    
    const { data: profileData } = await query.single()
    
    if (profileData) {
      setProfile(profileData)
      
      // Fetch user's posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false })
      
      setPosts(postsData || [])
      
      // Check if following
      if (user && user.id !== profileData.id) {
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profileData.id)
          .single()
        
        setIsFollowing(!!followData)
      }
    }
    
    setLoading(false)
  }

  const handleFollow = async () => {
    if (!user || !profile) return
    
    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: profile.id })
    }
    
    setIsFollowing(!isFollowing)
    fetchProfile() // Refresh counts
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!profile) return <div className="p-8 text-center">User not found</div>

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Profile Header */}
      <div className="p-4 flex gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0">
          {profile.avatar_url && (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-xl font-semibold">{profile.username}</h1>
            
            {isOwnProfile ? (
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-sm">
                  Edit profile
                </button>
                <button className="p-1.5">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleFollow}
                className={`px-6 py-1.5 rounded-lg font-semibold text-sm ${
                  isFollowing 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-3">
            <div className="text-center">
              <span className="font-bold block">{posts.length}</span>
              <span className="text-sm text-gray-500">posts</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{profile.followers_count}</span>
              <span className="text-sm text-gray-500">followers</span>
            </div>
            <div className="text-center">
              <span className="font-bold block">{profile.following_count}</span>
              <span className="text-sm text-gray-500">following</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-semibold">{profile.full_name}</p>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t dark:border-gray-800">
        <button className="flex-1 py-3 flex justify-center border-t-2 border-black dark:border-white">
          <Grid className="w-5 h-5" />
        </button>
        <button className="flex-1 py-3 flex justify-center text-gray-400">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="flex-1 py-3 flex justify-center text-gray-400">
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-100">
            <img 
              src={post.image_url} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No posts yet
        </div>
      )}
    </div>
  )
}