import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #6200ea;
  padding: 15px 30px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); /* Soft shadow */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  font-family: 'Roboto', sans-serif;
  height: 80px; /* Altura do cabeçalho */
`;

const ContentContainer = styled.div`
  padding-top: 80px; /* Ajuste para que o conteúdo não fique sobre o header */
`;

const Menu = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: ${({ isMobileMenuOpen }) => (isMobileMenuOpen ? "flex" : "none")};
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background-color: #333;
    padding: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 999;
    transform: ${({ isMobileMenuOpen }) =>
      isMobileMenuOpen ? "translateY(0)" : "translateY(-100%)"};
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.h1`
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: scale(1.05); /* Aumento sutil */
    color: #f9f7f3; /* Cor de destaque */
  }
`;

const MenuItem = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  margin: 0 15px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #f9f7f3; /* Cor de destaque */
    transform: translateY(-2px); /* Pequena translação para dar um toque de interatividade */
  }

  @media (max-width: 768px) {
    margin: 10px 0;
    font-size: 1.5rem; /* Aumenta o tamanho da fonte no mobile para maior legibilidade */
  }
`;

const MenuIcon = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30px;
  height: 25px;
  cursor: pointer;
  transition: opacity 0.3s ease;

  & div {
    width: 100%;
    height: 4px;
    background-color: white;
    border-radius: 5px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  &.open div:nth-child(1) {
    transform: rotate(45deg);
    position: relative;
    top: 8px;
  }

  &.open div:nth-child(2) {
    opacity: 0;
  }

  &.open div:nth-child(3) {
    transform: rotate(-45deg);
    position: relative;
    top: -8px;
  }

  &:hover {
    opacity: 0.8; /* Leve diminuição da opacidade */
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".menu-icon")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <>
      <HeaderContainer>
        <Logo onClick={() => navigate("/")}>COMEJACA</Logo>
        <MenuIcon
          onClick={toggleMenu}
          className={`menu-icon ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div></div>
          <div></div>
          <div></div>
        </MenuIcon>
        <Menu ref={menuRef} isMobileMenuOpen={isMobileMenuOpen}>
          <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
          <MenuItem onClick={() => navigate("/profile")}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </HeaderContainer>
      <ContentContainer>
        {/* O conteúdo principal vai aqui, como o seu Dashboard, etc. */}
      </ContentContainer>
    </>
  );
};

export default Header;
