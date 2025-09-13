import React, { useState } from "react";
import {
  X,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import Button from "./Button";
import Card from "./Card";
import Chat from "./Chat";
import { useSendMessageMutation } from "../../store/slices/api";
export default function BookingModal({
  isOpen,
  onClose,
  ride,
  onBook,
  currentUserId,
}) {
  const [message, setMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const [
    sendMessage,
    { isLoading: isSendingMessage, error: sendMessageError },
  ] = useSendMessageMutation();

  const handleBook = async (e) => {
  e.preventDefault();
  console.log("The Booking Modal is called with ride ", ride);
  setIsBooking(true);
  try {
    const result = await onBook(ride._id, ride.driverId._id);
    console.log("The result of the Booking Model is ", result);

    setBookingStatus("pending");
    setMessage("");

    // Show success message then close modal
    setTimeout(() => {
      onClose();
      setBookingStatus(null);
    }, 2000);

  } catch (error) {
    console.error("Booking failed:", error);
    setBookingStatus("error");
  } finally {
    setIsBooking(false);
  }
};


  const handleOpenChat = () => {
    setShowChat(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Book This Ride</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Ride Details */}
          <div className="p-6 space-y-6">
            {/* Ride Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Ride Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{ride.origin.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{ride.destination.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(ride.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {new Date(ride.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{ride.availableSeats}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${ride.pricePerSeat}/seat</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Driver Information
              </h3>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
                  <span className="text-white text-lg font-medium">
                    {ride.driverId.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {ride.driverId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ride.driver?.verificationStatus === "verified"
                      ? "✓ Verified Driver"
                      : "Unverified Driver"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message to Driver */}
            <div>
             
              <Button
                onClick={handleBook}
                disabled={isBooking || bookingStatus === "pending"}
                className="flex-1"
              >
                {isBooking
                  ? "Sending Request..."
                  : bookingStatus === "pending"
                  ? "Request Sent!"
                  : "Send Booking Request"}
              </Button>
            </div>

            {/* Status Messages */}
            {bookingStatus === "pending" && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <p className="font-medium">
                  Booking request sent successfully!
                </p>
                <p className="text-sm mt-1">
                  The driver will be notified and can approve or reject your
                  request. You'll receive a notification once they respond.
                </p>
              </div>
            )}

            {bookingStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="font-medium">Failed to send booking request</p>
                <p className="text-sm mt-1">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      
    </>
  );
}
