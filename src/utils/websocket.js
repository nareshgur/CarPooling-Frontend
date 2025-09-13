import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notificationsSlice";
import React from "react";

let socket = null; // Single instance

export const useSocket = (userId) => {
  const dispatch = useDispatch();
  console.log("The userId received to the websocket is", userId);
  
  React.useEffect(() => {
    if (userId) {
      if (!socket) {
        socket = io("http://localhost:3000", {
          transports: ['websocket', 'polling'],
          timeout: 20000,
        });
        
        // Add connection event listeners
        socket.on("connect", () => {
          console.log("🔌 WebSocket connected:", socket.id);
        });
        
        socket.on("connect_error", (error) => {
          console.error("❌ WebSocket connection error:", error);
        });
        
        socket.on("disconnect", (reason) => {
          console.log("🔌 WebSocket disconnected:", reason);
        });
      }

      console.log("🔑 Authenticating with userId:", userId);
      socket.emit("authenticate", { userId });

      // Listen for notifications
      socket.on("notification", (notif) => {
        console.log("📩 Notification received:", notif);
        dispatch(addNotification(notif));
        
        if (notif.type === "booking_approved") {
          alert(`�� Your ride has been approved!`);
        } else if (notif.type === "booking_rejected") {
          alert(`❌ Your ride request was rejected.`);
        }
      });
    }

    return () => {
      // Don't disconnect the socket here, just remove the event listener
      if (socket) {
        socket.off("notification");
      }
    };
  }, [userId, dispatch]);

  return socket;
};