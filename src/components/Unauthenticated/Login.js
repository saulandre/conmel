import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-size: 400% 400%;
  height: 90vh;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 2rem;
  box-sizing: border-box;
  background: #e7ecef;

  @media (max-width: 768px) {
    height: 100vh;
    min-height: 100vh;
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

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
    font-size: 2rem;
    margin-bottom: 1.25rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #6599ff 0%, #6599ff 100%);
  margin-top: 1rem;
/*   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #e36414 0%, #e36414 100%);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 0.25rem;
  }
`;





const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  @media (max-width: 768px) {
    gap: 12px;
  }
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

/*   &:focus-within {
    border-color: #4a4a4a;
 
  } */
    &:focus-within {
    border-color: #4a4e69;
    box-shadow: 0 0 3px rgba(74, 78, 105, 0.5);
  }
  &:hover {

    border: #6599FF 1px solid
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.8rem;
  }
`;


const AuthWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  padding: 2.5rem;
  margin: 1rem;
  background: #e7ecef;
  backdrop-filter: blur(20px);
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    padding-top: 1.25rem;
  }
`;



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
    font-size: 0.9rem; 
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #0d1b2a;
  font-size: 1.2rem;
  margin-right: 10px;

  @media (max-width: 600px) {
    font-size: 1rem; 
  }
`;





const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 600px) {
    font-size: 0.8rem; 
  }
`;
const AuthLink = styled.a`
  color: #0d1b2a;
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

const MobileForgotPasswordLink = styled.a`
  display: none;

  @media (max-width: 768px) {
    display: block;
    color: #0d1b2a;
    font-size: 0.9rem;
    text-decoration: none;
    text-align: right;
    margin-top: -4px;
    padding: 0.15rem 0;
    transition: color 0.3s ease;

    &:hover,
    &:active {
      text-decoration: underline;
      color: #0f3460;
    }
  }
`;

const AuthLinksWrapper = styled.div`
  margin-top: 1.5rem;
  display: grid;
  gap: 0.75rem;

  @media (max-width: 768px) {
    margin-top: 0.75rem;
    gap: 0.5rem;
  }
`;

const DesktopForgotPasswordLink = styled(AuthLink)`
  @media (max-width: 768px) {
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuário já está logado, redirecionando...');
      navigate('/painel');
    }
  }, [navigate]); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValido = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const senhaValida = formData.password && formData.password.length >= 8;

    if (!emailValido || !senhaValida) {
      setError('Preencha um e-mail válido e uma senha com pelo menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      localStorage.clear();
  
      const response = await axios.post(`${API_URL}/api/auth/entrar`, formData);
  
      const { token, user } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('nome', user.name);
      localStorage.setItem('email', user.email);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (formData.rememberMe ? 30 : 7));
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
  
      const redirectPath = user.isVerified ? '/painel' : '/verificar';
      navigate(redirectPath);
    } catch (err) {
      console.error("❌ Erro no login:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Usuário ou senha incorretos.');
        } else {
          setError(err.response.data.message || 'Erro inesperado. Tente novamente.');
        }
      } else {
        setError('Erro de rede ou servidor.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title> ENTRAR</Title>
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
type='password'
               name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
       
            />
          </InputWrapper>
          <MobileForgotPasswordLink href="/recuperarsenha">
            Esqueci a senha
          </MobileForgotPasswordLink>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Entrar'}
          </Button>
          <AuthLinksWrapper>
            <DesktopForgotPasswordLink href="/recuperarsenha">
              Esqueci a senha
            </DesktopForgotPasswordLink>
            <AuthLinkConta href="/registrar">Nova conta</AuthLinkConta>
          </AuthLinksWrapper>
        </Form>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Login;