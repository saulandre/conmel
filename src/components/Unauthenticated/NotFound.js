import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

// Animação de fundo (consistente com o login)
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container principal
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e7ecef, #e7ecef, #e7ecef);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

// Wrapper do conteúdo
const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 40px 30px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Título
const Title = styled.h1`
  font-size: 2.5rem;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  @media (max-width: 480px) {
    font-size: 2rem;
    flex-direction: column;
  }
`;

// Mensagem
const Message = styled.p`
  font-size: 1.1rem;
  color: #555;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  margin-bottom: 35px;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

// Botão de voltar
const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #22223b, #4a4e69);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #4a4e69, #22223b);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

// Ícone animado
const FloatingIcon = styled.div`
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

const NotFound = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>
          <FloatingIcon>
            <FontAwesomeIcon icon={faGhost} size="lg" />
          </FloatingIcon>
          404 - Página Não Encontrada
        </Title>
        
        <Message>
          A página que você está procurando pode ter sido removida, teve seu nome alterado
          ou está temporariamente indisponível.
        </Message>

        <BackButton to="/">
          Voltar para a Página Inicial
        </BackButton>
      </ContentWrapper>
    </Container>
  );
};

export default NotFound;