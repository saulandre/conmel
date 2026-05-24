import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getApiBaseUrl, AUTH_PATHS } from "../../config/api";
import {
  AuthContainer,
  AuthWrapper,
  Title,
  StyledInput,
  StyledButton,
  LinkVoltar,
} from "./SharedAuthStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const MessageBox = styled.div`
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.25rem;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ErrorBox = styled(MessageBox)`
  background: #ffebee;
  color: #b71c1c;
  border: 1px solid #ef9a9a;
`;

const SuccessBox = styled(MessageBox)`
  background: #e8f5e9;
  color: #1b5e20;
  border: 1px solid #a5d6a7;
`;

const LoginLinkButton = styled(Link)`
  display: block;
  background-color: #6599ff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  text-decoration: none;
  line-height: 30px;
`;

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => (searchParams.get("token") || "").trim(),
    [searchParams]
  );

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const password = formData.newPassword;

    if (password !== formData.confirmPassword) {
      setFormError("As senhas não coincidem.");
      return toast.error("As senhas não coincidem.");
    }

    if (!PASSWORD_REGEX.test(password)) {
      const msg =
        "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número.";
      setFormError(msg);
      return toast.error(msg);
    }

    if (!token) {
      setFormError("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${getApiBaseUrl()}${AUTH_PATHS.resetPassword}`,
        { token, newPassword: password },
        { timeout: 30000 }
      );

      setDone(true);
      toast.success("Senha redefinida com sucesso!");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Erro ao redefinir senha. Tente novamente.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthContainer>
        <AuthWrapper>
          <Title>
            <FontAwesomeIcon icon={faExclamationTriangle} /> Link inválido
          </Title>
          <ErrorBox role="alert">
            O link de redefinição está incompleto ou expirou. Solicite um novo
            e-mail em &quot;Esqueci a senha&quot;.
          </ErrorBox>
          <LinkVoltar>
            <Link to="/recuperarsenha">
              <FontAwesomeIcon icon={faArrowLeft} /> Solicitar novo link
            </Link>
            <br />
            <br />
            <Link to="/">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao login
            </Link>
          </LinkVoltar>
        </AuthWrapper>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Criar nova senha
        </Title>

        {done ? (
          <>
            <SuccessBox role="status">
              <FontAwesomeIcon icon={faCheckCircle} /> Senha alterada com sucesso.
              Você já pode entrar com a nova senha.
            </SuccessBox>
            <LoginLinkButton to="/">Ir para o login</LoginLinkButton>
          </>
        ) : (
          <>
            {formError && <ErrorBox role="alert">{formError}</ErrorBox>}
            <form onSubmit={handleSubmit} noValidate>
              <StyledInput
                type="password"
                name="newPassword"
                placeholder="Nova senha"
                value={formData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <StyledInput
                type="password"
                name="confirmPassword"
                placeholder="Confirmar nova senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <StyledButton type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Redefinir senha"}
              </StyledButton>
            </form>
          </>
        )}

        {!done && (
          <LinkVoltar>
            <Link to="/">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao login
            </Link>
          </LinkVoltar>
        )}
      </AuthWrapper>
    </AuthContainer>
  );
};

export default NovaSenha;
