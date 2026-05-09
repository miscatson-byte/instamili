import { useEffect, useRef, useState } from 'react'
import { usePostsStore } from '../store/postsStore'
import { Heart, MessageCircle, Share2, Music } from 'lucide-react'

export default function Reels() {
  const { reels, fetchReels, likePost } = usePostsStore()
  const [currentReel, setCurrentReel] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    fetchReels()
  }, [])

  const handleLike = async (postId: string) => {
    await likePost(postId)
  }

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel, index) => (
        <div 
          key={reel.id} 
          className="h-full snap-start relative bg-black"
        >
          {/* Video */}
          <video
            ref={el => videoRefs.current[index] = el}
            src={reel.video_url}
            className="w-full h-full object-cover"
            loop
            playsInline
            onClick={(e) => {
              if (e.currentTarget.paused) e.currentTarget.play()
              else e.currentTarget.pause()
            }}
          />

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-4">
            <button onClick={() => handleLike(reel.id)} className="flex flex-col items-center text-white">
              <Heart className="w-7 h-7" />
              <span className="text-xs">{reel.likes_count}</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <MessageCircle className="w-7 h-7" />
              <span className="text-xs">{reel.comments_count}</span>
            </button>
            <button className="text-white">
              <Share2 className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-16 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-600">
                {reel.user?.avatar_url && (
                  <img src={reel.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                )}
              </div>
              <span className="font-semibold">{reel.user?.username}</span>
            </div>
            <p className="text-sm mb-2">{reel.caption}</p>
            {reel.location && (
              <p className="text-xs flex items-center gap-1 opacity-80">
                <Music className="w-3 h-3" />
                {reel.location}
              </p>
            )}
          </div>
        </div>
      ))}

      {reels.length === 0 && (
        <div className="h-full flex items-center justify-center text-gray-500">
          No reels yet. Create your first reel!
        </div>
      )}
    </div>
  )
}