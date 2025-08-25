import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import React from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./utils/websocket";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log("The App component is called with user id ", user?.id);

  // This will set up the socket connection and authentication
  const socket = useSocket(user?.id);

  // Add socket status monitoring
  React.useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("✅ App: WebSocket connected successfully");
      });

      socket.on("disconnect", () => {
        console.log("❌ App: WebSocket disconnected");
      });
    }
  }, [socket]);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>

      {/* ✅ Toastify container - only one instance */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
