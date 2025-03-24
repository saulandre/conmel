import React, { useState, useEffect } from 'react';
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
  justify-content: center;
  min-height: 100vh;
 // background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
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

const VerificationCode = () => {
  const navigate = useNavigate();
      useEffect(() => {
        const token = localStorage.getItem("token");
      
        if (!token) {
          navigate("/");
        }
      }, [navigate]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Adicionando estado para controlar a submissão
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');  // Corrigido para o nome correto da chave
  
  console.log("Token:", token);
  console.log("Email do usuário:", userEmail);
  console.log("ID do usuário:", userId);
  
// Verifica se o token existe
if (token) {
  console.log("Token:", token);
} else {
  console.log("Nenhum token encontrado no localStorage.");
}




// Modificação do Input onChange para permitir apenas números
const handleCodeChange = (e) => {
  const inputValue = e.target.value;

  // Filtra para permitir apenas números e limita a 6 dígitos
  if (/^\d{0,6}$/.test(inputValue)) {
    setCode(inputValue);  // Atualiza o estado com o valor filtrado
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");
console.log("token: " + token);
  if (!token) {
    navigate("/");  // Caso não haja token, redireciona para a página inicial
  }
}, [navigate]);
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("ID do usuário:", userId);  // Verificar o ID do usuário
  if (code.length !== 6) {
    setError('Por favor, insira um código válido de 6 dígitos.');
    return;
  }

  setIsSubmitting(true); // Indicando que a submissão está em andamento

  try {
   const response = await axios.post(`${API_URL}/api/auth/verificar`,
      {
        userId: userId,
        verificationCode: code, // Envia o código digitado pelo usuário
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(userId, code, token);

    // Verifica se o usuário foi verificado
    if (response.data.user && response.data.user.isVerified) {
      
      setSuccess(true);
      setCode(''); // Limpa o campo de código
      localStorage.removeItem('verificationCode'); // Limpa o código de verificação do localStorage

      // Salva as informações do usuário e o token no localStorage
      const { id, name, email } = response.data.user;
      localStorage.setItem('user', JSON.stringify({ id, name, email }));
      localStorage.setItem('token', response.data.token); // Salvando o token

      alert('Conta verificada com sucesso!');
      navigate('/gestor '); 
    } else {
      setError(response.data.error || 'Erro desconhecido.');
    }
  } catch (err) {
    console.error('Erro ao verificar o código:', err);
    setError('Ocorreu um erro ao verificar o código. Tente novamente.');
  } finally {
    setIsSubmitting(false); // Finaliza o estado de submissão
  }
};
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("Usuário no localStorage:", user);  // Verificar o usuário no localStorage
}, []);
  const handleResendCode = async () => {
  
    setIsResendDisabled(true);
    setCountdown(60);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/enviarcodigo`,
        {
          email: userEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setError(''); // Limpa mensagens de erro anteriores
        setSuccess('Novo código enviado com sucesso!');
      } else {
        setError(response.data.message || 'Erro ao enviar o novo código.');
      }
    } catch (error) {
      console.error('Erro ao solicitar um novo código:', error);
      setError('Erro ao solicitar um novo código.');
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    if (code.length === 6) {
      handleSubmit(new Event('submit')); // Submete o formulário automaticamente
    }
  }, [code]);

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
            onChange={handleCodeChange}
            maxLength={6}
            inputMode="numeric"
          />
          <Button type="submit" disabled={isSubmitting || code.length !== 6}>
            {isSubmitting ? 'Ativando...' : 'Ativar'}
          </Button>
        </form>
        {success && <SuccessMessage>Código verificado com sucesso! 🎉</SuccessMessage>}
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
