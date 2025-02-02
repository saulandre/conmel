import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Título
const Title = styled.h2`
  font-size: 1.8rem;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

// Wrapper dos inputs
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;

  &:focus-within {
    border-color: #22223b;
    box-shadow: 0 0 5px rgba(34, 34, 59, 0.3);
  }
`;

// Input
const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-family: 'Poppins', sans-serif;

  &::placeholder {
    color: #aaa;
  }
`;

// Botão
const Button = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: ${props => props.disabled ? '#aaa' : 'linear-gradient(135deg, #22223b, #4a4e69)'};
  border: none;
  border-radius: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: ${props => props.disabled ? '#aaa' : 'linear-gradient(135deg, #4a4e69, #22223b)'};
    transform: ${props => props.disabled ? 'none' : 'scale(1.02)'};
  }
`;

// Link de voltar
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #22223b;
  font-size: 0.9rem;
  margin-top: 25px;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    color: #335c67;
    text-decoration: underline;
  }
`;

// Mensagem
const StatusMessage = styled.p`
  color: ${props => props.error ? '#d32f2f' : '#2e7d32'};
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  margin: 15px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.error ? '#ffebee' : '#e8f5e9'};
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage({ type: 'error', content: 'Por favor, insira um e-mail válido.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulação de requisição à API
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: 'success',
        content: 'Se o e-mail for válido, enviaremos instruções para redefinição de senha.'
      });
    }, 1500);
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faEnvelope} />
          RECUPERAR SENHA
        </Title>

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <FontAwesomeIcon icon={faEnvelope} color="#666" />
            <Input
              type="email"
              placeholder="Digite seu e-mail cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </InputWrapper>

          {message && (
            <StatusMessage error={message.type === 'error'}>
              {message.content}
            </StatusMessage>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !email}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
          </Button>
        </form>

        <BackLink to="/entrar">
          <FontAwesomeIcon icon={faArrowLeft} />
          Voltar para o Login
        </BackLink>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ForgotPassword;