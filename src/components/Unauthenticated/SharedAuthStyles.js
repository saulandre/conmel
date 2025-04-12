import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #e7ecef;
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

export const AuthWrapper = styled.div`
  background-color: #e7ecef;
  border-radius: 5px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

export const Title = styled.h2`
  color: #1b263b;
  margin-bottom: 30px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 50px;
`;

export const StyledButton = styled.button`
  background-color: #1b263b;
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

export const LinkVoltar = styled.div`
  margin-top: 5rem;
  color: #0d1b2a;
  a {
    color: inherit;
    text-decoration: none;
  }
`;
