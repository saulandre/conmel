import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';

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
  background:  linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 0;
  }
`;

// Wrapper do formulário
const AuthWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }

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
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

// Wrapper dos inputs
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
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
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [stage, setStage] = useState(1);  // Controla o fluxo das etapas
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;
  const isValidCode = (code) => code.length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (stage === 1) {
      // Validação de e-mail
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
        setStage(2); // Avança para a próxima etapa
      }, 1500);
    } else if (stage === 2) {
      // Validação do código
      if (!isValidCode(code)) {
        setMessage({ type: 'error', content: 'Por favor, insira um código válido.' });
        return;
      }

      setMessage({
        type: 'success',
        content: 'Código verificado com sucesso. Agora, insira sua nova senha.'
      });
      setStage(3);  // Avança para a etapa de redefinir senha
    } else if (stage === 3) {
      // Validação de senha
      if (!isValidPassword(newPassword)) {
        setMessage({ type: 'error', content: 'A senha precisa ter no mínimo 6 caracteres.' });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', content: 'As senhas não coincidem.' });
        return;
      }

      // Simulação de alteração de senha
      setTimeout(() => {
        setMessage({
          type: 'success',
          content: 'Sua senha foi alterada com sucesso!'
        });
        setStage(4); // Finalizou
      }, 1500);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          {stage === 1 && <FontAwesomeIcon icon={faEnvelope} />}
          {stage === 2 && <FontAwesomeIcon icon={faLock} />}
          {stage === 3 && <FontAwesomeIcon icon={faLock} />}
          {stage === 1 ? 'RECUPERAR SENHA' : stage === 2 ? 'INSIRA O CÓDIGO' : 'ALTERAR SENHA'}
        </Title>

        <form onSubmit={handleSubmit}>
          {stage === 1 && (
            <>
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
            </>
          )}

          {stage === 2 && (
            <>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Digite o código enviado por e-mail"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isSubmitting}
                />
              </InputWrapper>
            </>
          )}

          {stage === 3 && (
            <>
              <InputWrapper>
                <Input
                  type="password"
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type="password"
                  placeholder="Confirme sua Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </InputWrapper>
            </>
          )}

          {message && (
            <StatusMessage error={message.type === 'error'}>
              {message.content}
            </StatusMessage>
          )}

          <Button type="submit" disabled={isSubmitting || (stage === 1 && !email) || (stage === 2 && !code) || (stage === 3 && (!newPassword || !confirmPassword))}>
            {isSubmitting ? 'Enviando...' : stage === 1 ? 'Enviar Instruções' : stage === 2 ? 'Verificar Código' : 'Alterar Senha'}
          </Button>
        </form>

        <BackLink to="/">
          <FontAwesomeIcon icon={faArrowLeft} />
          Voltar para o Login
        </BackLink>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ForgotPassword;
