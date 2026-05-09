import Stories from '../components/feed/Stories';
import PostCard from '../components/feed/PostCard';

const posts = [
  {
    user: 'sara_travels',
    avatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    likes: 12483,
    caption: 'Golden hour magic on this beautiful beach 🌅✨',
    timeAgo: '2h'
  },
  {
    user: 'foodie_mike',
    avatar: 'https://i.pravatar.cc/150?img=2',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    likes: 8932,
    caption: 'Sunday brunch goals! 🥞☕',
    timeAgo: '5h'
  },
  {
    user: 'alps_explorer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    likes: 15234,
    caption: 'Mountain mornings hit different 🏔️',
    timeAgo: '8h'
  }
];

export default function Home() {
  return (
    <div>
      <Stories />
      <div className="space-y-0 md:space-y-6">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
}