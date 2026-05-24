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
import {
  getApiBaseUrl,
  AUTH_PATHS,
  getApiErrorMessage,
  isLegacyForgotPasswordNotFound,
  FORGOT_PASSWORD_GENERIC_MESSAGE,
} from "../../config/api";

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
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [disabled]);

  const showSuccess = (message) => {
    setSubmitted(true);
    setDisabled(true);
    setErrorMessage("");
    try {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 5000,
      });
    } catch {
      /* toast opcional */
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (loading || disabled) return;

    setErrorMessage("");
    setLoading(true);

    const trimmed = (email || "").trim();
    if (!trimmed) {
      setErrorMessage("Informe seu e-mail.");
      setLoading(false);
      return;
    }

    try {
      const apiBase = getApiBaseUrl();
      const url = `${apiBase}${AUTH_PATHS.forgotPassword}`;

      const { data } = await axios.post(
        url,
        { email: trimmed },
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const message =
        (data && typeof data === "object" && data.message) ||
        FORGOT_PASSWORD_GENERIC_MESSAGE;

      showSuccess(message);
    } catch (error) {
      if (isLegacyForgotPasswordNotFound(error)) {
        showSuccess(FORGOT_PASSWORD_GENERIC_MESSAGE);
        return;
      }

      const msg = getApiErrorMessage(
        error,
        "Não foi possível processar sua solicitação. Tente novamente."
      );

      setErrorMessage(msg);
      try {
        toast.error(msg, { position: "bottom-center" });
      } catch {
        /* toast opcional */
      }
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
            {errorMessage ? (
              <ErrorBox role="alert">{errorMessage}</ErrorBox>
            ) : null}
            <form onSubmit={handleReset} noValidate>
              <StyledInput
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                autoComplete="email"
                required
                disabled={loading || disabled}
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
