import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpar dados de autenticação ao fazer logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('verificationCode');
    
    // Redirecionar para a tela de login
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>Desconectando...</h2>
    </div>
  );
};

export default Logout;
