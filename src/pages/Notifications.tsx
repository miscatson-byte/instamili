import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Heart, MessageCircle, UserPlus } from 'lucide-react'

interface Notification {
  id: string
  type: string
  actor_id: string
  post_id: string
  is_read: boolean
  created_at: string
  actor?: {
    username: string
    avatar_url: string
  }
}

export default function Notifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    
    // Mark all as read
    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user?.id)
      .eq('is_read', false)
      .then(() => {})
  }, [])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:users(username, avatar_url)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) setNotifications(data)
    setLoading(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />
      default: return <Heart className="w-4 h-4" />
    }
  }

  const getText = (notif: Notification) => {
    switch (notif.type) {
      case 'like': return 'liked your post'
      case 'comment': return 'commented on your post'
      case 'follow': return 'started following you'
      default: return 'interacted with you'
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-bold p-4 border-b dark:border-gray-800">Notifications</h1>
      
      <div className="divide-y dark:divide-gray-800">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 flex items-center gap-3 ${
              !notif.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
              {notif.actor?.avatar_url && (
                <img src={notif.actor.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notif.actor?.username}</span>{' '}
                {getText(notif)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notif.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              {getIcon(notif.type)}
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <p className="text-center p-8 text-gray-500">No notifications yet</p>
      )}
    </div>
  )
}