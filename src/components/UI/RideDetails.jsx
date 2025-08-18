import React from "react";
import { useSelector } from "react-redux";
import { useSendLogMessageMutation } from "../../store/slices/api";

const RideDetails = ({ ride }) => {

  console.log("The Ride details are ",ride)
  const { driverId, origin, destination, dateTime } = ride || {};
  const driverName = driverId?.name;
  const driverPhone = driverId?.phone;
  const originName = origin?.name;
  const destinationName = destination?.name;

  const [sendLogMessage, { isLoading }] = useSendLogMessageMutation();

  // Get logged-in user (passenger)
  // const currentUser = useSelector((state) => state.auth.user);

  // WhatsApp message
  const message = `Hi ${driverName}, I’m interested in your ride from ${originName} to ${destinationName}`;
  const whatsappUrl = `https://wa.me/${driverPhone}?text=${encodeURIComponent(message)}`;

  const handleSendChat = async () => {
    // if (!currentUser?._id || !driverId?._id) {
    //   console.error("Missing passenger or driver ID");
    //   return;
    // }

    try {
      // Save log in DB
      await sendLogMessage({
        rideId: ride._id,
        senderId: driverId._id,
        receiverId: driverId._id,
        initiatedAt: new Date().toISOString(),
      }).unwrap();

      // Redirect to WhatsApp after saving log
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error logging chat:", error);
    }
  };

  return (
    <div className="p-4 shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-2">Ride Details</h2>

      <p>
        <strong>From:</strong> {originName}
      </p>
      <p>
        <strong>To:</strong> {destinationName}
      </p>
      <p>
        <strong>Departure:</strong>{" "}
        {dateTime ? new Date(dateTime).toLocaleString() : "Not provided"}
      </p>
      <p>
        <strong>Driver:</strong> {driverName}
      </p>

      {/* WhatsApp Contact Button */}
      {driverPhone && (
        <button
          onClick={handleSendChat}
          disabled={isLoading}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Logging..." : "Contact via WhatsApp"}
        </button>
      )}
    </div>
  );
};

export default RideDetails;
