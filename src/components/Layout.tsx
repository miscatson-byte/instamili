import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import MobileNav from './layout/MobileNav';
import Header from './layout/Header';
import { useAppStore } from '../store/useAppStore';

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {!isMobile && <Sidebar />}
      {isMobile && <Header />}
      
      <main className={`
        ${isMobile 
          ? 'pb-16 pt-14'
          : 'ml-64'
        }
      `}>
        <div className="max-w-[630px] mx-auto px-0 md:px-4">
          <Outlet />
        </div>
      </main>
      
      {isMobile && <MobileNav />}
    </div>
  );
}