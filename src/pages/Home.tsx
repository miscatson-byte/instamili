import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase';
import { usePostsStore } from '../store/postsStore'
import { useAuthStore } from '../store/authStore'
import { Heart, MessageCircle, Send, Bookmark, Share2, MapPin } from 'lucide-react'
import ShareModal from '../components/modals/ShareModal'

export default function Home() {
  const { posts, isLoading, fetchPosts, likePost, unlikePost } = usePostsStore()
  const { user } = useAuthStore()
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchLikedPosts()
  }, [])

  const fetchLikedPosts = async () => {
    if (!user) return
    const { data } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.id)
    
    if (data) {
      setLikedPosts(new Set(data.map(l => l.post_id)))
    }
  }

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) {
      await unlikePost(postId)
      setLikedPosts(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    } else {
      await likePost(postId)
      setLikedPosts(prev => new Set(prev).add(postId))
    }
  }

  const handleShare = (postId: string) => {
    setShareUrl(`${window.location.origin}/post/${postId}`)
    setShareModalOpen(true)
  }

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <div className="max-w-md mx-auto pb-16">
      {/* Stories */}
      <div className="flex gap-4 p-4 overflow-x-auto border-b dark:border-gray-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <p className="text-xs mt-1">Story {i}</p>
          </div>
        ))}
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="border-b dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center p-3 gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300">
              {post.user?.avatar_url && (
                <img src={post.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            <div>
              <span className="font-semibold text-sm">{post.user?.username || 'user'}</span>
              {post.location && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.location}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <img src={post.image_url} alt={post.caption} className="w-full aspect-square object-cover" />

          {/* Actions */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex gap-4">
                <button onClick={() => handleLike(post.id)}>
                  <Heart 
                    className={`w-6 h-6 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </button>
                <button>
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button onClick={() => handleShare(post.id)}>
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button>
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes */}
            <p className="font-semibold text-sm mb-1">{post.likes_count} likes</p>

            {/* Caption */}
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.user?.username}</span>
              {post.caption}
            </p>

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {post.hashtags.map(tag => (
                  <span key={tag} className="text-blue-500 text-sm">#{tag}</span>
                ))}
              </div>
            )}

            {/* Comments */}
            <p className="text-gray-500 text-sm mt-1">
              View all {post.comments_count} comments
            </p>
          </div>
        </div>
      ))}

      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        postUrl={shareUrl} 
      />
    </div>
  )
}