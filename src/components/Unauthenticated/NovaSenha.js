import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getApiBaseUrl,
  AUTH_PATHS,
  getPasswordResetTokenFromUrl,
  getApiErrorMessage,
} from "../../config/api";
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
  faSpinner,
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
  text-align: center;
`;

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

const NovaSenha = () => {
  const token = useMemo(() => getPasswordResetTokenFromUrl(), []);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (loading) return;

    const password = formData.newPassword;

    if (!token) {
      setFormError("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    if (password !== formData.confirmPassword) {
      const msg = "As senhas não coincidem.";
      setFormError(msg);
      toast.error(msg, { position: "bottom-center" });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      const msg =
        "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número.";
      setFormError(msg);
      toast.error(msg, { position: "bottom-center" });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${getApiBaseUrl()}${AUTH_PATHS.resetPassword}`,
        { token, newPassword: password },
        { timeout: 30000 }
      );

      setDone(true);
      toast.success(
        data?.message || "Senha redefinida com sucesso!",
        { position: "bottom-center" }
      );
    } catch (error) {
      const msg = getApiErrorMessage(
        error,
        "Erro ao redefinir senha. Tente novamente."
      );
      setFormError(msg);
      toast.error(msg, { position: "bottom-center" });
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
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Salvando...
                  </>
                ) : (
                  "Redefinir senha"
                )}
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
