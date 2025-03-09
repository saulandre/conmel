import React, { useState, useEffect } from 'react';
import { faArrowRight, faKey } from '@fortawesome/free-solid-svg-icons';
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

// Container principal atualizado
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

  background: linear-gradient(135deg, #f8edeb, #403d39, #f8edeb);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

// Nova tipografia com maior hierarquia
const Title = styled.h1`
  font-size: 2.5rem;
  color: #000;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #2a2a2a, #4a4a4a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align:center;
  margin-bottom: 2.5rem;
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

// Botão com microinterações aprimoradas
const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
  margin-top: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #000000 0%, #434343 100%);
  }
  @media (max-width: 768px) {
    display: none;
  }
`;





// Formulário
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
`;


const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff;;
  border: 1px solid #ccc;
  border-radius: 12px;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #4a4a4a;
 
  }
  &:hover {

    border: #46494c 1px solid
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.8rem;
  }
`;

// Layout adaptativo para mobile-first
const AuthWrapper = styled.div`
  width: 100%;
  max-width: 480px;

  padding: 2.5rem;
  margin: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 5px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 0;
    border-radius: 0;
    height: 100vh;
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
const AuthLink = styled.a`
  color: #22223b;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  text-align: center;

  &:hover {
    text-decoration: underline;
    transform: translateX(2px);
    color: #0f3460
  }

  @media (max-width: 768px) {
    &:first-child { /* Esconde apenas o link de recuperação */}
      display: none;
    }
  

  
`;

const AuthLinkConta = styled.a`
  color: #22223b;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  text-align: center;

  &:hover {
    text-decoration: underline;
    transform: translateX(2px);
    color: #0f3460
  }


  
`;
// Adicione estes componentes estilizados
const FloatingButtonContainer = styled.div`
   @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0; /* Remova o padding lateral */
    border-top: 1px solid #e0e0e0;

    background: linear-gradient(135deg, #f8edeb, #403d39, #f8edeb);
  }
`;


const FloatingButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 1.2rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    bottom: 0; 
    /* Estilo gradiente moderno */
    background:linear-gradient(135deg, #403d39, #000, #403d39);
    /* Efeito de hover */
    &:hover {
   
    }

    /* Efeito de clique */
    &:active {
      transform: translateY(0);
    }

    /* Linha decorativa no topo */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
    }

    /* Ícone */
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// Modifique o Botão original para esconder no mobile


// Adicionar estado de loading com spinner
const LoadingSpinner = styled.div`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
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
  const [areFieldsFilled, setAreFieldsFilled] = useState(false);

  useEffect(() => {
    const filled = formData.email.length > 0 && formData.password.length > 0;
    setAreFieldsFilled(filled);
  }, [formData.email, formData.password]);

  // Verificação de login ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuário já está logado, redirecionando...');
      navigate('/gestor'); // Redireciona para a página do painel ou gestor
    }
  }, [navigate]); // A dependência de navigate garante que o redirecionamento só aconteça uma vez

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 Iniciando fluxo de login...");

    if (!formData.email || !formData.password) {
      console.warn("⚠️ Campos vazios no formulário.");
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.warn("⚠️ E-mail inválido inserido:", formData.email);
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🚀 Enviando requisição para login...");
      console.log("URL da API:", API_URL);
      const response = await axios.post(`${API_URL}/api/auth/entrar`, formData);

      console.log("Resposta da API:", response.data);

      console.log("✅ Resposta recebida:", response);
      const { token, user } = response.data;

      console.log("🔑 Token recebido:", token);
      console.log("👤 Usuário autenticado:", user);

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (formData.rememberMe ? 30 : 7));
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());

      console.log("📅 Token válido até:", expirationDate.toISOString());

      const redirectPath = user.isVerified ? '/gestor' : '/verificar';
      console.log(`🔄 Redirecionando para: ${redirectPath}`);
      navigate(redirectPath);
    } catch (err) {
      console.error("❌ Erro ao fazer login:", err);
      if (err.response) {
        console.error("⚠️ Resposta do servidor:", err.response.data);
        
        if (err.response.status === 401) { // Código 401 indica credenciais inválidas
          setError('Usuário ou senha incorretos.');
        } else {
          setError(err.response.data.message || 'E-mail ou senha incorreto! Tente novamente..');
        }
      } else if (err.request) {
        console.error("⚠️ Sem resposta do servidor:", err.request);
        setError('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        console.error("⚠️ Erro ao configurar a requisição:", err.message);
        setError('Erro ao configurar a requisição.');
      }

    
    } finally {
      console.log("🔄 Resetando estado de carregamento...");
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>COMEJACA</Title>
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
          {error && <ErrorMessage>{error}</ErrorMessage>}

<Button type="submit" disabled={loading}>
  {loading ? <LoadingSpinner /> : 'Entrar'}
</Button>
<div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
            <AuthLink href="/recuperarsenha">Esqueci a senha</AuthLink>
            <AuthLinkConta href="/registrar">Nova conta</AuthLinkConta>
          </div>
          <FloatingButtonContainer>
          {areFieldsFilled ? (
  <FloatingButton primary type="submit" disabled={loading}>
    {loading ? (
      <LoadingSpinner />
    ) : (
      <>
        <FontAwesomeIcon icon={faKey} />
        Entrar
      </>
    )}
  </FloatingButton>
) : (
<FloatingButton as="a" href="/recuperarsenha">
  <FontAwesomeIcon icon={faArrowRight}  style={{ color: 'white' }} />
  <span style={{ color: 'white' }}>Esqueci a senha</span>
</FloatingButton>
)}
        </FloatingButtonContainer>
        </Form>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Login;