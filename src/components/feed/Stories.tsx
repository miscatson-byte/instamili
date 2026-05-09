import { motion } from 'framer-motion';

const stories = [
  { username: 'sara_travels', image: 'https://i.pravatar.cc/150?img=1', hasStory: true },
  { username: 'foodie_mike', image: 'https://i.pravatar.cc/150?img=2', hasStory: true },
  { username: 'alps_explorer', image: 'https://i.pravatar.cc/150?img=3', hasStory: true },
  { username: 'urban_vibes', image: 'https://i.pravatar.cc/150?img=4', hasStory: true },
  { username: 'art_daily', image: 'https://i.pravatar.cc/150?img=5', hasStory: false },
  { username: 'tech_guru', image: 'https://i.pravatar.cc/150?img=6', hasStory: true },
  { username: 'fitness_joe', image: 'https://i.pravatar.cc/150?img=7', hasStory: false },
  { username: 'design_lab', image: 'https://i.pravatar.cc/150?img=8', hasStory: true },
];

export default function Stories() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-4 overflow-x-auto py-4 px-4 md:px-0 scrollbar-hide"
    >
      {stories.map((story, index) => (
        <motion.div 
          key={story.username}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <div className={`
            w-16 h-16 rounded-full p-[2px]
            ${story.hasStory 
              ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
              : 'bg-gray-200 dark:bg-gray-800'
            }
          `}>
            <img 
              src={story.image} 
              alt={story.username}
              className="w-full h-full rounded-full border-2 border-white dark:border-black object-cover"
            />
          </div>
          <span className="text-xs truncate w-16 text-center">{story.username}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}