import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Animação de fundo
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #e7ecef;
  justify-content: center;
  min-height: 100vh;
 // background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  background-color:#e7ecef;
  border-radius: 20px;
//  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  //  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  }
`;

// Título
const Title = styled.h2`
  color: #22223b;
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
`;

// Parágrafo
const Paragraph = styled.p`
  color: #22223b;
  font-size: 1rem;
  margin-bottom: 20px;
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
`;

// Input
const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-family: 'Poppins', sans-serif;

  &:focus {
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(74, 78, 105, 0.5);
  }
`;

// Botão principal
const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  background: linear-gradient(135deg, #003049, #4a4e69);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 15px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: linear-gradient(135deg, #4a4e69, #22223b);
    transform: scale(1.03);
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;

    &:hover {
      background-color: #bdbdbd;
      transform: none;
    }
  }
`;

// Botão secundário
const SecondaryButton = styled(Button)`
  width: 150px;
  background: linear-gradient(135deg, #4a4e69, #22223b);

  &:hover {
    background: linear-gradient(135deg, #22223b, #4a4e69);
  }
`;

// Botão de logout
const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #6a040f, #9d0208);
  width: 150px;

  &:hover {
    background: linear-gradient(135deg, #9d0208, #6a040f);
  }
`;

// Grupo de botões
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

// Mensagem de erro
const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
`;

// Mensagem de sucesso
const SuccessMessage = styled.p`
  color: #388e3c;
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
`;

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function resolveUserId(storedUser) {
  if (storedUser?.id != null) {
    return Number(storedUser.id);
  }
  const fromStorage = localStorage.getItem('userId');
  return fromStorage ? Number(fromStorage) : null;
}

function resolveUserEmail(storedUser) {
  return (
    storedUser?.userEmail ||
    storedUser?.email ||
    localStorage.getItem('userEmail') ||
    localStorage.getItem('email') ||
    ''
  );
}

const VerificationCode = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  const storedUser = getStoredUser();
  const userId = resolveUserId(storedUser);
  const displayEmail = resolveUserEmail(storedUser);

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  const handleCodeChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setCode(inputValue);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();

    if (!userId) {
      setError('Sessão inválida. Faça login novamente.');
      return;
    }

    if (code.length !== 6) {
      setError('Por favor, insira um código válido de 6 dígitos.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setResendMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verificar`,
        {
          userId,
          verificationCode: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user?.isVerified) {
        setVerified(true);
        setCode('');
        localStorage.removeItem('verificationCode');

        const { id, name, email } = response.data.user;
        localStorage.setItem(
          'user',
          JSON.stringify({ id, name, email, userEmail: email })
        );
        localStorage.setItem('userId', String(id));
        localStorage.setItem('email', email);
        localStorage.setItem('nome', name);
        localStorage.setItem('isVerified', 'true');

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        alert('Conta verificada com sucesso!');
        if (window.location.hostname === 'localhost') {
          window.location.replace('http://localhost:3000/painel');
        } else {
          window.location.replace('https://www.conmelrj.com.br/painel');
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Ocorreu um erro ao verificar o código. Tente novamente.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [API_URL, code, token, userId]);

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setCountdown(60);
    setError('');
    setResendMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/enviarcodigo`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setResendMessage(response.data.message || 'Novo código enviado com sucesso!');
      } else {
        setError(response.data.message || response.data.error || 'Erro ao enviar o novo código.');
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Erro ao solicitar um novo código.';
      setError(message);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setIsResendDisabled(false);
  }, [countdown]);

  useEffect(() => {
    if (code.length === 6 && !isSubmitting && !verified) {
      handleSubmit();
    }
  }, [code, handleSubmit, isSubmitting, verified]);

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>PRÓXIMO PASSO</Title>
        <Paragraph>
          Enviamos um código para o e-mail <strong>{displayEmail}</strong>.
          <br />
          O código é válido por <strong>15 minutos</strong>.
          <br />
          Caso a confirmação não chegue na caixa de entrada, verifique a caixa de Spam.
        </Paragraph>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Digite o código de 6 dígitos"
            value={code}
            onChange={handleCodeChange}
            maxLength={6}
            inputMode="numeric"
          />
          <Button type="submit" disabled={isSubmitting || code.length !== 6}>
            {isSubmitting ? 'Ativando...' : 'Ativar'}
          </Button>
        </form>
        {verified && <SuccessMessage>Código verificado com sucesso! 🎉</SuccessMessage>}
        {resendMessage && <SuccessMessage>{resendMessage}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <SecondaryButton onClick={handleResendCode} disabled={isResendDisabled}>
            {isResendDisabled ? `Aguarde ${countdown}s` : 'Reenviar'}
          </SecondaryButton>
          <LogoutButton onClick={() => {
            localStorage.clear();
            navigate('/');
          }}>
            Sair
          </LogoutButton>
        </ButtonGroup>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default VerificationCode;
