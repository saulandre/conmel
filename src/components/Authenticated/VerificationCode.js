import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Styled Components
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #22223b, #335c67);
  padding: 20px;
`;

const AuthWrapper = styled.div`
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #22223b;
  font-size: 2rem;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Paragraph = styled.p`
  color: #22223b;
  font-size: 1rem;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(74, 78, 105, 0.5);
  }
`;
const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  background-color: #22223b;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 15px;

  &:hover {
  
    background: linear-gradient(135deg, #22223b, #335c67);

    transform: scale(1.03);
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;

    /* Remove o hover quando desabilitado */
    &:hover {
      background-color: #bdbdbd;
      box-shadow: none;
    }
  }
`;

const SecondaryButton = styled(Button)`
  width: 150px;

  &:hover {
  
    box-shadow: none;
  }

  &:disabled {
    /* Remover hover para botões desativados */
    &:hover {
      background-color: #bdbdbd;
      box-shadow: none;
    }
  }
`;

const LogoutButton = styled(Button)`
  background-color: #6a040f;
  width: 150px;

  &:hover {
    background-color: #b71c1b;
  }

  &:disabled {
    /* Remover hover para botões desativados */
    &:hover {
      background-color: #bdbdbd;
      box-shadow: none;
    }
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: #388e3c;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const VerificationCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || 'não encontrado';

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/entrar');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (code.length !== 6) {
      setError("Por favor, insira um código válido de 6 dígitos.");
      return;
    }
  
    const userId = localStorage.getItem("userId"); // Recuperando o ID do usuário
    const token = localStorage.getItem("token"); // Recuperando o token
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/verificar",
        {
          userId: userId,
          verificationCode: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token no cabeçalho
          },
        }
      );
  
      // Verificação bem-sucedida
      if (response.data.isVerified) {
        alert("Conta verificada com sucesso!");
        navigate("/gestor"); // Redireciona para a rota do cliente
      } else {
        setError(response.data.error || "Erro desconhecido.");
      }
    } catch (err) {
      console.error("Erro ao verificar o código:", err);
      setError("Ocorreu um erro ao verificar o código. Tente novamente.");
    }
  };
  
  
  
  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setCountdown(60);
  
    const token = localStorage.getItem('token'); // Recuperando o token de autenticação
  console.log(token)
    if (!token) {
      setError('Você não está autenticado.');
      setIsResendDisabled(false);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/auth/novocodigo', {
        email: userEmail,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviando o token no cabeçalho
        }
      });
  
      if (response.data.success) {
        alert('Novo código enviado com sucesso!');
      } else {
        setError('Erro ao enviar o novo código.');
      }
    } catch (error) {
      setError('Erro ao solicitar um novo código.');
    }
  };
  

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }else {
      // Enable the "Reenviar" button after the countdown reaches 0
      setIsResendDisabled(false);
    }
  }, [countdown]);

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>PRÓXIMO PASSO</Title>
        <Paragraph>
          Enviamos um código para o e-mail <strong>{userEmail}</strong>.
        </Paragraph>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Digite o código de 6 dígitos"
            value={code}
            onChange={handleChange}
            maxLength={6}
          />
          <Button type="submit" disabled={code.length !== 6}>
            Ativar
          </Button>
        </form>
        {success && <SuccessMessage>Código verificado com sucesso! 🎉</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <SecondaryButton onClick={handleResendCode} disabled={isResendDisabled}>
            {isResendDisabled ? `Aguarde ${countdown}s` : 'Reenviar'}
          </SecondaryButton>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </ButtonGroup>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default VerificationCode;
