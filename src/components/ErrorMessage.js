import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Styled Components
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 30px;
  margin: 0 auto;
  background-color: #f0f2f5;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  font-size: 2.8rem;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
`;

const Paragraph = styled.p`
  color: #555;
  font-size: 1rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6200ea;
    box-shadow: 0 0 3px rgba(98, 0, 234, 0.5);
  }

  ${({ isError }) => isError && `
    border-color: #d32f2f;
  `}
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  background-color: #6200ea;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background-color: #ddd;
  }

  &:hover {
    background-color: #4500a8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.95rem;
  margin-top: 10px;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: #008000;
  font-size: 0.95rem;
  margin-top: 10px;
  text-align: center;
`;

const ResendButton = styled(Button)`
  margin-top: 20px;
  background-color: #008000;

  &:hover {
    background-color: #005700;
  }
`;

const LogoutLink = styled.a`
  color: #6200ea;
  font-size: 1rem;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const VerificationCode = ({ userId, onVerified }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendError, setResendError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);

  const { logout, token, email } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Por favor, faça login novamente.');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('O código deve ter 6 dígitos numéricos.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:4000/auth/verify',
        { userId, code },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        onVerified();
      } else {
        setError('Código de verificação inválido.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Você não está autorizado. Por favor, faça login novamente.');
        logout();  // Chama o logout para limpar o estado
        navigate('/login');  // Redireciona para a página de login
      } else {
        setError('Erro ao verificar código. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setResendDisabled(true);

      const response = await axios.post('http://localhost:4000/auth/resend-verification-code', { email });

      if (response.data.success) {
        setResendSuccess('Código reenviado com sucesso!');
        setResendError(null);
      } else {
        setResendError(response.data.message || 'Erro desconhecido ao reenviar o código. Tente novamente.');
        setResendSuccess(null);
      }
    } catch (err) {
      setResendError(err.response?.data?.message || 'Erro ao reenviar código. Verifique sua conexão.');
      setResendSuccess(null);
    } finally {
      setResendLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();  // Chama a função logout do contexto
    navigate('/login');  // Redireciona para o login
  };

  return (
    <AuthContainer>
      <Title>Código de verificação</Title>
      <Paragraph>
        Um código de verificação foi enviado para o seu e-mail <strong>{email}</strong>. Insira o código abaixo para continuar.
      </Paragraph>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="verificationCode"
          value={code}
          onChange={handleChange}
          placeholder="Digite o código de verificação"
          required
          inputMode="numeric"
          isError={error && code.length !== 6}  // Feedback visual para código incompleto
          autocomplete="off"  // Adicionando autocomplete para evitar sugestões indesejadas
        />
        <Button
          type="submit"
          disabled={loading || code.length !== 6}
          aria-label="Verificar código de verificação"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </Button>

        <ResendButton
          onClick={handleResend}
          disabled={resendDisabled || resendLoading}
          aria-label="Reenviar código de verificação"
        >
          {resendLoading
            ? 'Reenviando...'
            : resendDisabled
            ? `Aguarde ${timer}s`
            : 'Reenviar Código'}
        </ResendButton>
      </form>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {resendError && <ErrorMessage>{resendError}</ErrorMessage>}
      {resendSuccess && <SuccessMessage>{resendSuccess}</SuccessMessage>}

      <LogoutLink onClick={handleLogout}>Sair</LogoutLink>
    </AuthContainer>
  );
};

export default VerificationCode;
