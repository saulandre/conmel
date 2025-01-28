import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Cria um contexto chamado AuthContext, que será usado para compartilhar informações de autenticação
export const AuthContext = createContext();

// Componente AuthProvider, que fornecerá o contexto de autenticação para os componentes filhos
export const AuthProvider = ({ children }) => {
  // Define os estados necessários para gerenciar a autenticação
  const [userId, setUserId] = useState(null); // Armazena o ID do usuário
  const [userName, setUserName] = useState(null); // Armazena o nome do usuário
  const [isVerified, setIsVerified] = useState(false); // Armazena se o usuário está verificado
  const [loading, setLoading] = useState(true); // Indica se os dados estão sendo carregados
  const [error, setError] = useState(null); // Armazena mensagens de erro

  // Função para recuperar o token de autenticação do localStorage
  const getToken = () => {
    try {
      return localStorage.getItem('authToken'); // Tenta recuperar o token
    } catch {
      return null; // Retorna null se houver erro
    }
  };

  // Função para salvar o token de autenticação no localStorage
  const setToken = (token) => {
    try {
      localStorage.setItem('authToken', token); // Tenta salvar o token no localStorage
    } catch {
      console.error('Erro ao salvar o token.'); // Exibe erro no console caso falhe
    }
  };

  // Função para remover o token e limpar o estado de autenticação
  const clearAuth = () => {
    localStorage.removeItem('authToken');
    setUserId(null);
    setUserName(null);
    setIsVerified(false);
  };

  // useEffect para verificar o token assim que o componente for montado
  useEffect(() => {
    const token = getToken(); // Recupera o token do localStorage

    if (token) {
      // Se houver um token, envia uma requisição para verificar sua validade
      axios
        .post('http://localhost:4000/auth/verify-token', { token })
        .then((response) => {
          if (response.data.success) {
            // Se o token for válido, define os dados do usuário
            setUserId(response.data.userId);
            setIsVerified(response.data.isVerified);
            setUserName(response.data.name);
          } else {
            clearAuth(); // Se o token não for válido, limpa o estado
          }
        })
        .catch((err) => {
          console.error('Erro ao validar token:', err);
          setError('Sessão expirada. Por favor, faça login novamente.');
          clearAuth(); // Remove o token inválido
        })
        .finally(() => {
          if (loading) setLoading(false); // Certifique-se de que setLoading(false) só é chamado uma vez
        });
    } else {
      setLoading(false); // Se não houver token, termina o carregamento
    }
  }, [loading]); // O useEffect será executado apenas uma vez, logo após o primeiro render

  // Função para realizar o login: define o token e os dados do usuário
  const login = (token, userId, name, isVerified) => {
    setToken(token); // Salva o token
    setUserId(userId); // Define o ID do usuário
    setUserName(name); // Define o nome do usuário
    setIsVerified(isVerified); // Define se o usuário está verificado
  };

  // Função para realizar o logout: remove o token e limpa os dados do usuário
  const logout = () => {
    clearAuth(); // Centraliza a lógica de logout
  };

  return (
    // O AuthContext.Provider fornece os dados de autenticação para os componentes filhos
    <AuthContext.Provider
      value={{ userId, userName, isVerified, loading, error, login, logout }}
    >
      {children} {/* Renderiza os filhos do AuthProvider */}
    </AuthContext.Provider>
  );
};
