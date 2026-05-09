import { useState } from 'react';
import { Grid, Bookmark, UserSquare, Settings, Plus, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const profilePosts = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
];

const savedPosts = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
];

const taggedPosts = [
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400',
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const { fakeUser: user, updateProfile } = useAppStore();

  const [editForm, setEditForm] = useState({
    name: user?.name || 'Your Name',
    username: user?.username || 'your_username',
    bio: user?.bio || '📷 Photography enthusiast\n🌍 Travel | Food | Lifestyle',
    link: user?.link || 'linktr.ee/yourname',
  });

  const handleSave = () => {
    updateProfile(editForm);
    setShowEditModal(false);
  };

  const getPosts = () => {
    switch (activeTab) {
      case 'posts': return profilePosts;
      case 'saved': return savedPosts;
      case 'tagged': return taggedPosts;
    }
  };

  return (
    <div className="py-8 px-4">
      {/* Profile Header */}
      <div className="flex items-start gap-8 mb-8">
        <div className="relative">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[3px]">
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150?img=20"} 
              alt="Profile" 
              className="w-full h-full rounded-full border-2 border-white dark:border-black object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full border-2 border-white dark:border-black">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-black dark:text-white">{user?.username || 'your_username'}</h2>
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 font-semibold text-sm rounded-lg hover:bg-gray-200 text-black dark:text-white"
            >
              Edit profile
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Settings className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
          
          <div className="flex gap-8 mb-4">
            <div className="text-center">
              <span className="font-bold text-black dark:text-white">42</span>
              <span className="text-gray-500 ml-1">posts</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-black dark:text-white">2.4k</span>
              <span className="text-gray-500 ml-1">followers</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-black dark:text-white">380</span>
              <span className="text-gray-500 ml-1">following</span>
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-black dark:text-white">{user?.name || 'Your Name'}</p>
            {user?.bio?.split('\n').map((line, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400 text-sm">{line}</p>
            ))}
            <a href="#" className="text-blue-500 text-sm">{user?.link || 'linktr.ee/yourname'}</a>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['Travel', 'Food', 'Nature', 'Selfies'].map((highlight, i) => (
          <div key={highlight} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border border-gray-200 dark:border-gray-800 p-[2px]">
              <img 
                src={`https://i.pravatar.cc/150?img=${30 + i}`} 
                alt={highlight}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-black dark:text-white">{highlight}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-black dark:text-white">New</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider
            ${activeTab === 'posts' ? 'border-t border-black dark:border-white text-black dark:text-white' : 'text-gray-500'}
          `}
        >
          <Grid className="w-4 h-4" /> Posts
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider
            ${activeTab === 'saved' ? 'border-t border-black dark:border-white text-black dark:text-white' : 'text-gray-500'}
          `}
        >
          <Bookmark className="w-4 h-4" /> Saved
        </button>
        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider
            ${activeTab === 'tagged' ? 'border-t border-black dark:border-white text-black dark:text-white' : 'text-gray-500'}
          `}
        >
          <UserSquare className="w-4 h-4" /> Tagged
        </button>
      </div>

      {/* Posts Grid */}
      <motion.div 
        layout
        className="grid grid-cols-3 gap-1 md:gap-4 mt-4"
      >
        {getPosts().map((post, index) => (
          <motion.div
            key={`${activeTab}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square relative group cursor-pointer"
          >
            <img src={post} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white transition-opacity">
              <div className="flex items-center gap-1">
                <span className="font-bold">♥</span>
                <span>{Math.floor(Math.random() * 1000) + 100}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">💬</span>
                <span>{Math.floor(Math.random() * 100) + 10}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-lg text-black dark:text-white">Edit Profile</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Avatar Change */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="relative">
                    <img 
                      src={user?.avatar || "https://i.pravatar.cc/150?img=20"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <button className="text-blue-500 font-semibold text-sm">Change Photo</button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                  <input
                    type="text"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}