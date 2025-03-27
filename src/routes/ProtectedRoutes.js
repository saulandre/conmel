import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  const savedToken = localStorage.getItem('token');
  const isVerified = localStorage.getItem('isVerified') === 'true';

  if (!savedToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return location.pathname === '/verificar' ? children : <Navigate to="/verificar" replace />;
  }

  if (location.pathname === '/verificar') {
    return <Navigate to="/gestor" replace />;
  }

  return children;
};

export default ProtectedRoute;
