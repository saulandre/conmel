import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // Certifique-se de que axiosInstance está configurado corretamente
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Animação de fundo
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container principal
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* Impede o scroll */
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 600px) {
    padding: 15px;
    max-width: 90%; /* Reduz a largura máxima em telas pequenas */
  }
`;

// Título
const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    font-size: 1.5rem; /* Reduz o tamanho do título em telas pequenas */
  }
`;

// Formulário
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Wrapper dos inputs
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus-within {
    border-color: #22223b;
    box-shadow: 0 0 5px #22223b;
  }

  @media (max-width: 600px) {
    padding: 8px; /* Reduz o padding em telas pequenas */
  }
`;

// Inputs
const Input = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-family: 'Poppins', sans-serif;

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 600px) {
    font-size: 0.9rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Ícones
const Icon = styled(FontAwesomeIcon)`
  color: #22223b;
  font-size: 1.2rem;
  margin-right: 10px;

  @media (max-width: 600px) {
    font-size: 1rem; /* Reduz o tamanho do ícone em telas pequenas */
  }
`;

// Botão de submit
const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #22223b, #4a4e69);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #4a4e69, #22223b);
    transform: scale(1.03);
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 10px; /* Reduz o padding em telas pequenas */
    font-size: 0.9rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Container do "Manter conectado"
const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Label do "Manter conectado"
const RememberMeLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Mensagem de erro
const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Link de "Esqueci a senha"
const ForgotPasswordLink = styled.a`
  color: #22223b;
  font-size: 0.9rem;
  margin-top: 15px;
  display: block;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
    color: #335c67;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Link de "Criar conta"
const SignupLink = styled.a`
  color: #22223b;
  font-size: 0.9rem;
  margin-top: 10px;
  display: block;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
    color: #335c67;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    if (!email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await axiosInstance.post(`${API_URL}/api/auth/entrar`, formData, { timeout: 5000 });
      const { token, user } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);
  
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (formData.rememberMe ? 30 : 7));
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
  
      navigate(user.isVerified ? '/gestor' : '/verificar');
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      if (err.response) {
        setError(err.response.data.message || 'Erro ao fazer login. Tente novamente.');
      } else if (err.request) {
        setError('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        setError('Erro ao configurar a requisição.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>ENTRAR</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Icon icon={faEnvelope} />
            <Input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </InputWrapper>
          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </InputWrapper>
          <RememberMeContainer>
            <RememberMeLabel>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Manter conectado
            </RememberMeLabel>
          </RememberMeContainer>
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ForgotPasswordLink href="/recuperarsenha">Esqueci a senha</ForgotPasswordLink>
          <SignupLink href="/registrar">Ainda não é cadastrado? Crie sua conta</SignupLink>
        </Form>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Login;