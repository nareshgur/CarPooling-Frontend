import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '../components/UI/Header';
// import MobileMenu from './MobileMenu';
import { setSidebarOpen } from '../store/slices/uiSlice';

export default function MainLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(setSidebarOpen(false));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* <MobileMenu /> */}
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}