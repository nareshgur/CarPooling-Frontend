import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Publish from "./pages/Publish";
import AppRoutes from "./routes/AppRoutes";
import React from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./utils/websocket";

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
    </>
  );
}

export default App;