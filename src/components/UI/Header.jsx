import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, Search, Plus, Car, Bike } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import NotificationCenter from './NotificationCenter';
import { useGetMyNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation, useDeleteNotificationMutation } from '../../store/slices/api';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const [userMenuOpen, setUserMenuOpen] = useState(false);



  console.log("The user information is user",user)
  // Fix: Properly destructure the query result and provide fallback
  const { data: notifications = [], error: notificationsError, isLoading: notificationsLoading } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  console.log('User object:', user);
  console.log('Notifications:', notifications);
  console.log('Safe notifications:', safeNotifications);

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                RideShare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/search')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Find a Ride</span>
            </Link>
            
            <Link
              to="/publish"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/publish')
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Publish a Ride</span>
            </Link>

            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500">
              <Car className="h-4 w-4" />
              <span>&</span>
              <Bike className="h-4 w-4" />
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name || user?.email || 'User'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">
                        {user?.name || user?.email || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || 'No email'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {user?.rating || '0'}
                          </span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">
                          {user?.totalTrips || '0'} trips
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/rides/my-rides"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Rides
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/vehicles"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Vehicles
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Notification Center - Pass safeNotifications instead of notifications */}
            <NotificationCenter
              notifications={safeNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
        </div>
      </div>
    </header>
  );
}