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
  background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  padding: 30px;
  border-radius: 16px;
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
`;

// Título
const Title = styled.h2`
  text-align: center;
  color: #22223b;
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
`;

// Wrapper dos inputs
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;

  &:focus-within {
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(74, 78, 105, 0.5);
  }
`;

// Inputs
const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
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
`;

// Botão de submit
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #22223b, #4a4e69);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, #4a4e69, #22223b);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

// Mensagem de erro
const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;
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
`;

// Ícones
const Icon = styled.span`
  margin-right: 10px;
  color: #4a4e69;
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
      const response = await axios.post('http://localhost:4000/api/auth/registrar', {
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
        <StyledLink to="/entrar">Já tem uma conta? Faça login aqui.</StyledLink>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Register;