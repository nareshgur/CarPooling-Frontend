import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Publish from '../pages/Publish';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import MyRides from '../pages/MyRides';
import ProfileEdit from '../components/UI/ProfileEdit';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  console.log("Checking the Protected Route", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  console.log("Checking the Public Route", isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />

      {/* Protected Routes with MainLayout */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="/rides/my-rides" element={<MyRides/>}/>
        <Route path="search" element={<Search />} />
        <Route path="publish" element={<Publish />} />
        <Route path="/profile" element={<ProfileEdit />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
