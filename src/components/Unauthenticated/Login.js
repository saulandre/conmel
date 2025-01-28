import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // Certifique-se de que axiosInstance está configurado corretamente
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #22223b;
    box-shadow: 0 0 5px #22223b;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #333;

  &::placeholder {
    color: #aaa;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #22223b;
  font-size: 1.2rem;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 15px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #22223b, #22223b);
    border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {


    background: linear-gradient(135deg, #22223b, #335c67);

    transform: scale(1.03);
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RememberMeLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
`;

const ForgotPasswordLink = styled.a`
  color: #22223b;
  font-size: 0.9rem;
  margin-top: 20px;
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #335c67;
  }
`;

const SignupLink = styled.a`
  color: #22223b;
  font-size: 0.9rem;
  margin-top: 10px;
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #335c67;
  }
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('http://localhost:4000/auth/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (formData.rememberMe ? 30 : 7));
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());

      navigate(user.isVerified ? '/gestor' : '/verificar');
    } catch (err) {
      console.error(err);
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>ENTRAR</Title>
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
            />
          </InputWrapper>
          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <RememberMeContainer>
            <RememberMeLabel>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Manter conectado
            </RememberMeLabel>
          </RememberMeContainer>
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ForgotPasswordLink href="/recuperar-senha">Esqueci a senha</ForgotPasswordLink>
          <SignupLink href="/novaconta">Ainda não é cadastrado? Crie sua conta</SignupLink>
        </Form>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Login;
