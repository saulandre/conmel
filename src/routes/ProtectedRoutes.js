import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isVerified = localStorage.getItem('isVerified'); // Verifica se o usuário foi verificado
  const savedToken = localStorage.getItem('token');
  
  if (!savedToken) {
    return <Navigate to="/login" />; // Se não estiver autenticado, vai para o login
  }
  
  if (savedToken && !isVerified) {
    return <Navigate to="/verify" />; // Se o usuário estiver autenticado mas não verificado, vai para /verify
  }

  return children; // Se estiver autenticado e verificado, exibe a página solicitada
};

export default ProtectedRoute;
