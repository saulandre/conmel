import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faLock,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { getApiBaseUrl, AUTH_PATHS } from "../../config/api";

const GENERIC_SUCCESS_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha em instantes.";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LinkVoltar = styled.div`
  margin-top: 2rem;
  color: #0d1b2a;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #e7ecef;
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

const AuthWrapper = styled.div`
  background-color: #e7ecef;
  border-radius: 5px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #000;
  margin-bottom: 30px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 50px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: #d64042;
  }

  &:focus {
    border-color: #d64042;
    outline: none;
  }
`;

const StyledButton = styled.button`
  background-color: #d64042;
  color: #fff;
  padding: 10px 20px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  height: 50px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const MessageBox = styled.div`
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.25rem;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const SuccessBox = styled(MessageBox)`
  background: #e8f5e9;
  color: #1b5e20;
  border: 1px solid #a5d6a7;
`;

const ErrorBox = styled(MessageBox)`
  background: #ffebee;
  color: #b71c1c;
  border: 1px solid #ef9a9a;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (disabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [disabled]);

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage("Informe seu e-mail.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${getApiBaseUrl()}${AUTH_PATHS.forgotPassword}`,
        { email: trimmed },
        { timeout: 30000 }
      );

      setSubmitted(true);
      setDisabled(true);
      toast.success(data?.message || GENERIC_SUCCESS_MESSAGE, {
        position: "bottom-center",
        autoClose: 5000,
      });
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message || "";

      // Compatibilidade: backend antigo em produção devolvia 404 se e-mail não existia
      const legacyNotFound =
        status === 404 &&
        /n[aã]o encontrado|not found/i.test(apiMessage);

      if (legacyNotFound) {
        setSubmitted(true);
        setDisabled(true);
        toast.success(GENERIC_SUCCESS_MESSAGE, {
          position: "bottom-center",
          autoClose: 5000,
        });
        return;
      }

      if (!error.response) {
        setErrorMessage(
          "Sem conexão com o servidor. Verifique sua internet e tente novamente."
        );
        toast.error("Falha de conexão. Tente novamente.", {
          position: "bottom-center",
        });
        return;
      }

      const msg =
        status >= 500
          ? "Serviço temporariamente indisponível. Tente em alguns minutos."
          : apiMessage ||
            "Não foi possível processar sua solicitação. Tente novamente.";

      setErrorMessage(msg);
      toast.error(msg, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Recuperar senha
        </Title>

        {submitted ? (
          <SuccessBox role="status">
            <FontAwesomeIcon icon={faCheckCircle} />{" "}
            <strong>Solicitação recebida.</strong>
            <br />
            Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua
            senha. Verifique também a caixa de spam.
          </SuccessBox>
        ) : (
          <>
            {errorMessage && <ErrorBox role="alert">{errorMessage}</ErrorBox>}
            <form onSubmit={handleReset} noValidate>
              <StyledInput
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
              <StyledButton type="submit" disabled={loading || disabled}>
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : disabled ? (
                  `Aguarde ${countdown}s`
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} /> Enviar e-mail
                  </>
                )}
              </StyledButton>
            </form>
          </>
        )}

        <LinkVoltar>
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar para o login
          </Link>
        </LinkVoltar>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ForgotPassword;
