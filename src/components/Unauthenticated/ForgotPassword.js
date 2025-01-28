import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled Components
const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a5acd, #9370db);
  color: #fff;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #9370db;
  margin-bottom: 20px;
  font-family: "Roboto", sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6200ea;
    box-shadow: 0 0 8px rgba(98, 0, 234, 0.5);
  }

  &::placeholder {
    color: #aaa;
  }
`;
const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #6a5acd, #9370db);
    border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {


    background: linear-gradient(135deg, #5b4bc1, #8365c8);

    transform: scale(1.03);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const BackToLogin = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: #6200ea;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    text-decoration: underline;
    color: #4500a8;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: -10px;
  margin-bottom: 20px;
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
      setMessage("Por favor, insira um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage(
        "Se o e-mail for válido, enviaremos um link para redefinir sua senha."
      );
    }, 1500);
  };

  return (
    <ForgotPasswordContainer>
      <FormContainer>
        <Title>RECUPERAR SENHA</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            aria-label="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <ErrorMessage>{message}</ErrorMessage>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Recuperar"}
          </Button>
        </form>
        <BackToLogin onClick={() => navigate("/entrar")}>Voltar para a página de login</BackToLogin>
      </FormContainer>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
