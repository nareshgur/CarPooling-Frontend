import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import Button from './Button';
import Notification from './Notification';
import { useSelector, useDispatch } from 'react-redux';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../store/slices/notificationsSlice';
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetMyNotificationsQuery,
} from '../../store/slices/api';

import { useApproveBookingMutation,useRejectBookingMutation } from '../../store/slices/bookingApi';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector((state) => state.notifications.list);
  const dispatch = useDispatch();
  const [ApproveBooking] = useApproveBookingMutation()
  const [RejectBooking,] = useRejectBookingMutation()
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotificationApi] = useDeleteNotificationMutation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id).unwrap();
      dispatch(markAsRead(id));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id).unwrap();
      dispatch(deleteNotification(id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="mt-2 w-full"
              >
                Mark All as Read
              </Button>
            )}
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                 <Notification
                 key={notification._id}
                 notification={notification}
                 onMarkAsRead={() => handleMarkAsRead(notification._id)}
                 onDelete={() => handleDelete(notification._id)}
                 onApprove={(notif) => {
                   console.log("✅ Approve clicked", notif);
                   // Call backend API to approve booking
                   ApproveBooking(notif?.data?.bookingId)
                 }}
                 onReject={(notif) => {
                   console.log("❌ Reject clicked", notif);
                   // Call backend API to reject booking
                    RejectBooking(notif?.data?.bookingId)
                 }}
               />
              
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
