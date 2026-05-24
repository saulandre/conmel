import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #e7ecef;
`;

const Card = styled.div`
  max-width: 440px;
  width: 100%;
  padding: 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;

  h2 {
    margin: 0 0 12px;
    color: #22223b;
    font-size: 1.25rem;
  }

  p {
    margin: 0 0 20px;
    color: #4a4e69;
    line-height: 1.5;
  }

  a {
    color: #6599ff;
    font-weight: 600;
    text-decoration: none;
  }
`;

/**
 * Evita tela branca se algum erro de renderização escapar no fluxo de recuperação.
 */
class PasswordRecoveryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[password-recovery] Erro de renderização:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Card>
            <h2>Não foi possível carregar esta página</h2>
            <p>
              Ocorreu um erro inesperado. Você pode tentar novamente ou voltar ao
              login.
            </p>
            <Link to="/">Voltar ao login</Link>
            {" · "}
            <Link to="/recuperarsenha">Recuperar senha</Link>
          </Card>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

export default PasswordRecoveryErrorBoundary;
