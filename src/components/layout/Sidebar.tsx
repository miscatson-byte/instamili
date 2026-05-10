import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Compass, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User, 
  Menu,
  Settings,
  Bookmark,
  Moon,
  Sun,
  Flag,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: Compass, label: 'Reels', path: '/reels' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Heart, label: 'Notifications', path: '/notifications' },
  { icon: PlusSquare, label: 'Create', path: '/create' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const [showMore, setShowMore] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAppStore();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const moreItems = [
    { icon: Settings, label: 'Settings', action: () => alert('Settings coming soon!') },
    { icon: Bookmark, label: 'Saved', action: () => alert('Saved posts coming soon!') },
    { 
      icon: isDark ? Sun : Moon, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      action: toggleTheme 
    },
    { icon: Flag, label: 'Report a Problem', action: () => alert('Report feature coming soon!') },
    { icon: HelpCircle, label: 'Help', action: () => alert('Help center coming soon!') },
  ];

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-50 flex flex-col">
      <div className="p-6 pt-8">
        <h1 className="text-2xl font-bold tracking-tight cursor-pointer bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] bg-clip-text text-transparent" 
  onClick={() => navigate('/')} 
>
  Instamili
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'font-bold bg-gray-100 dark:bg-gray-900 text-black dark:text-white' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-black dark:text-white'
              }
            `}
          >
            <item.icon className="w-7 h-7" />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
        
        <div className="relative">
          <button 
            onClick={() => setShowMore(!showMore)}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full transition-all duration-200
              ${showMore ? 'font-bold bg-gray-100 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}
              text-black dark:text-white
            `}
          >
            <Menu className="w-7 h-7" />
            <span className="text-base">More</span>
          </button>

          {showMore && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 mb-2">
                <span className="font-semibold text-black dark:text-white">More Options</span>
                <button onClick={() => setShowMore(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-4 h-4 text-black dark:text-white" />
                </button>
              </div>
              {moreItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setShowMore(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left text-black dark:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMore(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}