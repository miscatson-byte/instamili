import { useEffect } from 'react'
import { usePostsStore } from '../store/postsStore'
import { useAuthStore } from '../store/authStore'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'

export default function Home() {
  const { posts, isLoading, fetchPosts, likePost, unlikePost } = usePostsStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId)
    } catch (err) {
      console.error('Like failed:', err)
    }
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
          {/* Post Header */}
          <div className="flex items-center p-3 gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300">
              {post.user?.avatar_url && (
                <img src={post.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            <span className="font-semibold text-sm">{post.user?.username || 'user'}</span>
          </div>

          {/* Post Image */}
          <img 
            src={post.image_url} 
            alt={post.caption} 
            className="w-full aspect-square object-cover"
          />

          {/* Actions */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex gap-4">
                <button onClick={() => handleLike(post.id)}>
                  <Heart className="w-6 h-6 hover:text-red-500" />
                </button>
                <button>
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button>
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <button>
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes Count */}
            <p className="font-semibold text-sm mb-1">
              {post.likes_count} likes
            </p>

            {/* Caption */}
            <p className="text-sm">
              <span className="font-semibold mr-2">{post.user?.username}</span>
              {post.caption}
            </p>

            {/* Comments */}
            <p className="text-gray-500 text-sm mt-1">
              View all {post.comments_count} comments
            </p>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No posts yet. Create your first post!
        </div>
      )}
    </div>
  )
}