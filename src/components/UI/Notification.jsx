import React from 'react';
import { Bell, Check, X, Info, AlertCircle } from 'lucide-react';
import Button from './Button';

const notificationIcons = {
  booking_request: Info,
  booking_approved: Check,
  booking_rejected: X,
  message: Bell,
  ride_update: AlertCircle
};

const notificationColors = {
  booking_request: 'bg-blue-50 border-blue-200 text-blue-800',
  booking_approved: 'bg-green-50 border-green-200 text-green-800',
  booking_rejected: 'bg-red-50 border-red-200 text-red-800',
  message: 'bg-purple-50 border-purple-200 text-purple-800',
  ride_update: 'bg-yellow-50 border-yellow-200 text-yellow-800'
};

export default function Notification({ notification, onMarkAsRead, onDelete }) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colors = notificationColors[notification.type] || 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <div className={`p-4 border rounded-lg ${colors} ${!notification.isRead ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${notification.isRead ? 'opacity-60' : ''}`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          <p className="text-xs mt-2 opacity-70">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-1">
          {!notification.isRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(notification._id)}
              className="h-6 px-2 text-xs"
            >
              Mark Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(notification._id)}
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
