import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, roles, requiredRole }) => {
  if (!isAuthenticated || !roles.includes(requiredRole)) {
    // Redirect to home or login if the user isn't authorized
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
