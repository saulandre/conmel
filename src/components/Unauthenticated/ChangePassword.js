import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  AuthContainer,
  AuthWrapper,
  Title,
  StyledInput,
  StyledButton,
  LinkVoltar,
} from "./SharedAuthStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// SharedAuthStyles.js
import styled from "styled-components";










const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("A nova senha e a confirmação não coincidem.");
    }

    try {
      setLoading(true);

      // Envia apenas a nova senha
      await axios.post(
        `${API_URL}/api/auth/change-password`,
        { newPassword: formData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao alterar a senha."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Alterar Senha
        </Title>
        <form onSubmit={handleSubmit}>
          <StyledInput
            type="password"
            name="newPassword"
            placeholder="Nova senha"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nova senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <StyledButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Alterar Senha"}
          </StyledButton>
        </form>
        <LinkVoltar>
          <a href="/">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </a>
        </LinkVoltar>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ChangePassword;
