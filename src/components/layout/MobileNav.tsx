import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Clapperboard, User } from 'lucide-react';

const mobileNavItems = [
  { icon: Home, path: '/' },
  { icon: Search, path: '/explore' },
  { icon: PlusSquare, path: '/create' },
  { icon: Clapperboard, path: '/reels' },
  { icon: User, path: '/profile' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-around px-2">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            p-2 rounded-lg transition-all duration-200
            ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}
          `}
        >
          <item.icon className="w-6 h-6" />
        </NavLink>
      ))}
    </nav>
  );
}