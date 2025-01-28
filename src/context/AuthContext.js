import React, { createContext, useState, useEffect } from "react";

// Cria o contexto de autenticação
const AuthContext = createContext();

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica o token no localStorage para determinar se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);  // Se o token existir, define o estado como autenticado
    } else {
      setIsAuthenticated(false); // Caso contrário, define como não autenticado
    }
  }, []);

  // Função de logout para remover o token e atualizar o estado de autenticação
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children} {/* Renderiza os filhos (componentes) dentro do provedor */}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir o contexto de autenticação
export const useAuth = () => React.useContext(AuthContext);
