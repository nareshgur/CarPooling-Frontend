import React from 'react';
import { Bell, Check, X, Info, AlertCircle, MessageCircle } from 'lucide-react';
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

export default function Notification({ notification, onMarkAsRead, onDelete, onApprove, onReject }) {
  const Icon = notificationIcons[notification.type] || Bell;
  const colors = notificationColors[notification.type] || 'bg-gray-50 border-gray-200 text-gray-800';

  // WhatsApp link (assuming passenger phone is in notification.data.contactNumber)
  const whatsappLink = notification?.data?.contactNumber
    ? `https://wa.me/${notification.data.contactNumber}`
    : null;

  return (
    <div
      className={`p-4 border rounded-lg ${colors} ${
        !notification.isRead ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${notification.isRead ? 'opacity-60' : ''}`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          <p className="text-xs mt-2 opacity-70">
            {new Date(notification.createdAt).toLocaleString()}
          </p>

          {/* ✅ Action Buttons for booking_request */}
          {notification.type === 'booking_request' && (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => onApprove(notification)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onReject(notification)}
              >
                Reject
              </Button>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm border rounded-lg text-green-700 border-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {/* Mark Read + Delete */}
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
