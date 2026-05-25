import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #e7ecef;
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  padding: 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;

  h2 {
    margin: 0 0 12px;
    color: #22223b;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 20px;
    color: #4a4e69;
    line-height: 1.5;
  }

  button,
  a {
    color: #6599ff;
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1rem;
    text-decoration: none;
    margin: 0 8px;
  }
`;

/**
 * Impede tela branca quando um erro de renderização escapa em rotas autenticadas.
 */
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[AppErrorBoundary]", error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Card>
            <h2>Não foi possível carregar esta área</h2>
            <p>Tente atualizar a página. Se o problema continuar, volte ao login.</p>
            <button type="button" onClick={this.handleRetry}>
              Atualizar página
            </button>
            <Link to="/">Ir para o login</Link>
          </Card>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
