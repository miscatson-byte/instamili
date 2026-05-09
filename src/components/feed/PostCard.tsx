import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostProps {
  user: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  timeAgo: string;
}

export default function PostCard({ user, avatar, image, likes, caption, timeAgo }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
    } else {
      setLikeCount(prev => prev - 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 md:border md:rounded-xl md:mb-6"
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
            <img src={avatar} alt={user} className="w-full h-full rounded-full border-2 border-white dark:border-black object-cover" />
          </div>
          <div>
            <span className="font-semibold text-sm">{user}</span>
            <span className="text-gray-500 text-xs ml-2">{timeAgo}</span>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="relative aspect-square bg-gray-100">
        <img src={image} alt="Post" className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
          >
            <Heart 
              className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-black dark:text-white'}`} 
            />
          </motion.button>
          <button>
            <MessageCircle className="w-7 h-7" />
          </button>
          <button>
            <Send className="w-7 h-7" />
          </button>
        </div>
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark className={`w-7 h-7 ${saved ? 'fill-black dark:fill-white' : ''}`} />
        </motion.button>
      </div>

      <div className="px-3 pb-3">
        <p className="font-semibold text-sm mb-1">{likeCount.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{user}</span>{' '}
          {caption}
        </p>
        <p className="text-gray-500 text-sm mt-1 cursor-pointer">View all comments</p>
        <div className="mt-2 flex items-center">
          <input 
            type="text" 
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button className="text-blue-500 text-sm font-semibold opacity-50 hover:opacity-100">
            Post
          </button>
        </div>
      </div>
    </motion.article>
  );
}