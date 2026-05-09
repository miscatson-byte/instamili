import { useState } from 'react';
import { Search, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const explorePosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', likes: 4523, comments: 234 },
  { id: 2, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', likes: 8921, comments: 567 },
  { id: 3, image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', likes: 3456, comments: 123 },
  { id: 4, image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', likes: 6789, comments: 345 },
  { id: 5, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', likes: 2345, comments: 89 },
  { id: 6, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', likes: 9876, comments: 678 },
  { id: 7, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', likes: 5432, comments: 234 },
  { id: 8, image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', likes: 7654, comments: 456 },
  { id: 9, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400', likes: 1234, comments: 67 },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="py-6 px-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 rounded-lg outline-none text-sm"
        />
      </div>

      {/* Search Suggestions */}
      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {['nature', 'travel', 'food', 'photography', 'art'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full text-xs cursor-pointer hover:bg-gray-100">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {explorePosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-square cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img 
              src={post.image} 
              alt="Explore" 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {hoveredId === post.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="font-semibold">{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
