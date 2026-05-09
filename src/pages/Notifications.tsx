import { useState } from 'react';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';

const notifications = [
  { id: 1, type: 'like', user: 'foodie_mike', avatar: 'https://i.pravatar.cc/150?img=2', text: 'liked your photo', time: '2m', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100' },
  { id: 2, type: 'comment', user: 'alps_explorer', avatar: 'https://i.pravatar.cc/150?img=3', text: 'commented: "Amazing shot! 🔥"', time: '15m', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100' },
  { id: 3, type: 'follow', user: 'urban_vibes', avatar: 'https://i.pravatar.cc/150?img=4', text: 'started following you', time: '1h' },
  { id: 4, type: 'like', user: 'art_daily', avatar: 'https://i.pravatar.cc/150?img=5', text: 'liked your comment', time: '2h' },
  { id: 5, type: 'mention', user: 'tech_guru', avatar: 'https://i.pravatar.cc/150?img=6', text: 'mentioned you in a comment', time: '3h', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100' },
  { id: 6, type: 'follow', user: 'fitness_joe', avatar: 'https://i.pravatar.cc/150?img=7', text: 'started following you', time: '5h' },
  { id: 7, type: 'like', user: 'design_lab', avatar: 'https://i.pravatar.cc/150?img=8', text: 'liked your reel', time: '1d', image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=100' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
    case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500 fill-blue-500" />;
    case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
    case 'mention': return <AtSign className="w-5 h-5 text-purple-500" />;
    default: return <Heart className="w-5 h-5 text-red-500" />;
  }
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'follows'>('all');

  const filtered = activeTab === 'all' ? notifications : notifications.filter(n => n.type === 'follow');

  return (
    <div className="py-6 px-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Notifications</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-2 text-sm font-semibold ${activeTab === 'all' ? 'border-b-2 border-black dark:border-white' : 'text-gray-500'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab('follows')}
          className={`pb-2 text-sm font-semibold ${activeTab === 'follows' ? 'border-b-2 border-black dark:border-white' : 'text-gray-500'}`}
        >
          Follows
        </button>
      </div>

      {/* Today Section */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Today</h3>
        <div className="space-y-3">
          {filtered.slice(0, 4).map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <div className="relative">
                <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full" />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5">
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notif.user}</span>{' '}
                  {notif.text}
                  <span className="text-gray-500 ml-1">{notif.time}</span>
                </p>
              </div>
              {notif.image && (
                <img src={notif.image} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              {notif.type === 'follow' && (
                <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
                  Follow
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Earlier Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Earlier</h3>
        <div className="space-y-3">
          {filtered.slice(4).map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 4) * 0.05 }}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <div className="relative">
                <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full" />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5">
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notif.user}</span>{' '}
                  {notif.text}
                  <span className="text-gray-500 ml-1">{notif.time}</span>
                </p>
              </div>
              {notif.image && (
                <img src={notif.image} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              {notif.type === 'follow' && (
                <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
                  Follow
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
