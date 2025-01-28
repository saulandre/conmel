import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
  padding: 20px;
  box-sizing: border-box;
`;

const Content = styled.div`
  text-align: center;
  background-color: #fff;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #6200ea;
  font-weight: 700;
  margin-bottom: 15px;

  @media (max-width: 600px) {
    font-size: 2.8rem;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  color: #4500a8;
  font-size: 1.1rem;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid #4500a8;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background-color: #4500a8;
    border-color: #6200ea;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Content>
        <Title>404 - Página Não Encontrada</Title>
        <Message>Desculpe, não conseguimos encontrar a página que você está procurando.</Message>
        <BackLink to="/">Voltar para a Página Inicial</BackLink>
      </Content>
    </Container>
  );
};

export default NotFound;
