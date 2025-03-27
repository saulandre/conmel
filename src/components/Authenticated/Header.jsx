import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from 'styled-components';
import { FiUser, FiLogOut, FiMoon, FiMenu, FiPlus, FiUpload } from "react-icons/fi";

// Temas otimizados
export const themes = {
  professional: {
    background: 'linear-gradient(135deg, #003049, #003049, #003049)',
    cardBackground: '#e7ecef',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #003049, #003049)',
    tableHeaderBackground: '#003049',
    tableHeaderColor: 'white',
    tableRowEvenBackground: '#f8f9fa',
    tableRowHoverBackground: '#f1f3f5',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    mobileHeaderHeight: '80px'
  },
  minimalista: {
    background: '#f5f5f5',
    cardBackground: 'white',
    textColor: '#333',
    buttonBackground: '#333',
    tableHeaderBackground: '#f5f5f5',
    tableHeaderColor: '#333',
    tableRowEvenBackground: '#fafafa',
    tableRowHoverBackground: '#e0e0e0',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};

// Componentes Estilizados Otimizados
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  font-family: 'Poppins', sans-serif;
  padding: 0;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.cardBackground};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  border-bottom: 1px solid ${({ theme }) => theme.textColor}20;
  backdrop-filter: blur(10px);
  margin: 0;

  @media (max-width: 768px) {
    padding: 1rem;
    
    position: block;
    width: 100%;
    top: -10;
    left: 0;
    right: 0;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.mobileHeaderHeight};
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.cardBackground};
  z-index: 999;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '-100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.1);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 3rem 1rem;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-top: ${({ theme }) => theme.mobileHeaderHeight};
  }
`;

const FloatingActions = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 1000;

  button {
    background: ${({ theme }) => theme.buttonBackground};
    color: white;
    border: none;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.1);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);

      &::after {
        opacity: 1;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  @media (max-width: 768px) {
    bottom: 1.25rem;
    right: 1.25rem;
    
    button {
      width: 48px;
      height: 48px;
    }
  }
`;

const HeaderMain = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(themes.professional);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === themes.professional ? themes.minimalista : themes.professional;
      localStorage.setItem("theme", newTheme === themes.professional ? "professional" : "minimalista");
      return newTheme;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    
    localStorage.removeItem('email');
   
    navigate('/');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "professional";
    setTheme(savedTheme === "professional" ? themes.professional : themes.minimalista);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <Title>INSCRIÇÕES 2025</Title>
          
          <Nav>
            <Button onClick={() => navigate('/gestor')}>
              <FiPlus size={20} /> Home
            </Button>
            <Button onClick={() => navigate('/inscrever')}>
              <FiPlus size={20} /> Inscrever
            </Button>
            <Button onClick={() => navigate('/instituicao')}>
              <FiUpload size={20} /> IE
            </Button>
            <Button onClick={() => navigate('/perfil')}>
              <FiUser size={20} /> Perfil
            </Button>
          </Nav>

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <FiMenu size={24} />
          </MobileMenuButton>
        </Header>

        <MobileMenu $isOpen={isMenuOpen}>
          <Button onClick={() => { navigate('/gestor'); setIsMenuOpen(false) }}>
            <FiPlus size={20} /> Home
          </Button>
          <Button onClick={() => { navigate('/inscrever'); setIsMenuOpen(false) }}>
            <FiPlus size={20} /> Inscrever
          </Button>
          <Button onClick={() => { navigate('/instituicao'); setIsMenuOpen(false) }}>
            <FiUpload size={20} /> IE
          </Button>
          <Button onClick={() => { navigate('/perfil'); setIsMenuOpen(false) }}>
            <FiUser size={20} /> Perfil
          </Button>
        </MobileMenu>

      

        <FloatingActions>
          <button onClick={toggleTheme} aria-label="Alternar tema">
            <FiMoon size={24} />
          </button>
          <button onClick={handleLogout} aria-label="Sair">
            <FiLogOut size={24} />
          </button>
        </FloatingActions>
      </Container>
    </ThemeProvider>
  );
};

export default HeaderMain;