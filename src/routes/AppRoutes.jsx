// src/routes/AppRoutes.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Publish from "../pages/Publish";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "search", element: <Search /> },
        { path: "publish", element: <Publish /> },
        { path: "profile", element: <div className="p-8 text-center">Profile Page - Coming Soon</div> },
        { path: "rides/my-rides", element: <div className="p-8 text-center">My Rides Page - Coming Soon</div> },
        { path: "bookings", element: <div className="p-8 text-center">Bookings Page - Coming Soon</div> },
        { path: "vehicles", element: <div className="p-8 text-center">Vehicles Page - Coming Soon</div> },
        { path: "login", element: <div className="p-8 text-center">Login Page - Coming Soon</div> },
        { path: "register", element: <div className="p-8 text-center">Register Page - Coming Soon</div> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
