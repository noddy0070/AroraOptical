import React from 'react';
import { Navigate, Outlet,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
   const { isAuthenticated, user } = useSelector((state) => state.auth); // Access authentication info from Redux
    const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="./login" replace/>;
  }

  // Case-insensitive check for admin routes
  if (user?.role === 'user' && location.pathname.toLowerCase().includes('/admin')) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};

export {ProtectedRoute};


