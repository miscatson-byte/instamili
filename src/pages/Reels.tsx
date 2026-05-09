import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const reelsData = [
  {
    id: 1,
    user: 'dance_queen',
    avatar: 'https://i.pravatar.cc/150?img=10',
    thumbnail: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400',
    caption: 'New dance routine! 💃🔥',
    likes: 45600,
    comments: 1234,
    music: 'Original Audio - dance_queen'
  },
  {
    id: 2,
    user: 'chef_ramen',
    avatar: 'https://i.pravatar.cc/150?img=11',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    caption: 'Perfect ramen in 30 seconds 🍜',
    likes: 89200,
    comments: 3456,
    music: 'Trending Audio - FoodTok'
  },
  {
    id: 3,
    user: 'travel_bug',
    avatar: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    caption: 'Switzerland is unreal 🏔️✨',
    likes: 123000,
    comments: 5678,
    music: 'Original Audio - travel_bug'
  },
  {
    id: 4,
    user: 'fitness_guru',
    avatar: 'https://i.pravatar.cc/150?img=13',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    caption: 'Morning workout routine 💪',
    likes: 34500,
    comments: 890,
    music: 'Workout Mix 2026'
  },
];

export default function Reels() {
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(true);

  const toggleLike = (id: number) => {
    setLikedReels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedReels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="py-4 space-y-6">
      <h2 className="text-xl font-bold px-4 mb-4">Reels</h2>
      
      {reelsData.map((reel, index) => (
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-black rounded-xl overflow-hidden mx-auto max-w-[400px]"
        >
          {/* Video Thumbnail */}
          <div className="relative aspect-[9/16]">
            <img 
              src={reel.thumbnail} 
              alt={reel.caption}
              className="w-full h-full object-cover"
            />
            
            {/* Mute Button */}
            <button 
              onClick={() => setMuted(!muted)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <img src={reel.avatar} alt={reel.user} className="w-8 h-8 rounded-full border border-white" />
                <span className="text-white font-semibold text-sm">{reel.user}</span>
                <button className="ml-2 px-3 py-1 border border-white/50 rounded text-white text-xs">
                  Follow
                </button>
              </div>
              <p className="text-white text-sm mb-1">{reel.caption}</p>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> {reel.music}
              </p>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center gap-1"
              >
                <Heart 
                  className={`w-7 h-7 ${likedReels.has(reel.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
                <span className="text-white text-xs">
                  {(reel.likes + (likedReels.has(reel.id) ? 1 : 0)).toLocaleString()}
                </span>
              </motion.button>
              
              <button className="flex flex-col items-center gap-1">
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="text-white text-xs">{reel.comments.toLocaleString()}</span>
              </button>
              
              <button>
                <Send className="w-7 h-7 text-white" />
              </button>
              
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleSave(reel.id)}
              >
                <Bookmark className={`w-7 h-7 ${savedReels.has(reel.id) ? 'fill-white text-white' : 'text-white'}`} />
              </motion.button>
              
              <button>
                <MoreHorizontal className="w-7 h-7 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
