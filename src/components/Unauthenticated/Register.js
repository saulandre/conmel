import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

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
  background:linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* Impede o scroll */

  @media (max-width: 768px) {
padding: 0;
  }
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }
`;

// Título
const Title = styled.h2`
  text-align: center;
  color: #22223b;
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 1.5rem; /* Reduz o tamanho do título em telas pequenas */
  }
`;

// Wrapper dos inputs
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 15px;

  &:focus-within {
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(74, 78, 105, 0.5);
  }

  @media (max-width: 600px) {
    padding: 8px; /* Reduz o padding em telas pequenas */
  }
`;

// Inputs
const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: transparent;
  font-family: 'Poppins', sans-serif;
  color: #333;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 600px) {
    font-size: 0.9rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Botão de submit
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg,rgb(15, 15, 20), #22223b);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 10px; /* Reduz o padding em telas pequenas */
    font-size: 0.9rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Mensagem de erro
const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Link estilizado
const StyledLink = styled(Link)`
  color: #22223b;
  text-decoration: none;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 15px;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    color: #335c67;
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Ícones
const Icon = styled.span`
  margin-right: 10px;
  color: #4a4e69;

  @media (max-width: 600px) {
    font-size: 0.9rem; /* Reduz o tamanho do ícone em telas pequenas */
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
  
    if (!isValidEmail(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/registrar`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
  
        // Aqui estamos pegando o id da resposta da API e salvando no localStorage
        const { id, name, email } = response.data.user; // Supondo que o id, name e email estão na resposta
  
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: name,
            userEmail: email, // Salvando o e-mail como 'userEmail'
            id: id, // Salvando o id
          })
        );
  
        localStorage.setItem('isVerified', 'false');
  
        setError('Código de verificação enviado. Por favor, verifique seu e-mail.');
        navigate('/verificar');
      }
  
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao registrar usuário');
      console.error('Erro de registro:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>CRIAR CONTA</Title>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Icon><FiUser /></Icon>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome completo"
              required
              aria-label="Nome completo"
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FiMail /></Icon>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
              aria-label="E-mail"
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FiLock /></Icon>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              required
              aria-label="Senha"
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FiLock /></Icon>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar senha"
              required
              aria-label="Confirmar senha"
            />
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledLink to="/">Já tem uma conta? Faça login aqui.</StyledLink>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Register;