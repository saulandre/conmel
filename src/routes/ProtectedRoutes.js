import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const savedToken = localStorage.getItem('token');
  const isVerified = localStorage.getItem('isVerified') === 'true'; // Converte para booleano
  const location = useLocation();

  // Se não houver token, redireciona para a página de login
  if (!savedToken) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  // Se houver token, mas o usuário não estiver verificado, redireciona para a página de verificação
  // (a menos que já esteja na página de verificação)
  if (savedToken && !isVerified && location.pathname !== '/verificar') {
    return <Navigate to="/verificar" state={{ from: location }} replace />;
  }

  // Se o usuário estiver verificado e tentar acessar a página de verificação, redireciona para o dashboard
  if (savedToken && isVerified && location.pathname === '/verificar') {
    return <Navigate to="/gestor" replace />;
  }

  // Se o usuário estiver autenticado e verificado, renderiza o conteúdo protegido (children)
  return children;
};

export default ProtectedRoute;