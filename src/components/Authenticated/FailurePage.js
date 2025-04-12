import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  background: 'linear-gradient(135deg, #0d1b2a, #0d1b2a, #0d1b2a)',
  cardBackground: '#e7ecef',
  textColor: '#22223b',
  buttonBackground: 'linear-gradient(135deg, #0d1b2a, #0d1b2a)',
  tableHeaderBackground: '#0d1b2a',
  tableHeaderColor: 'white',
  tableRowEvenBackground: '#f8f9fa',
  tableRowHoverBackground: '#f1f3f5',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  mobileHeaderHeight: '80px',
};

const FailurePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <ContentWrapper>
          <FormCard>
            <EmptyStateMessage>
              ❌ O pagamento falhou. Por favor, tente novamente ou utilize outro método de pagamento.
            </EmptyStateMessage>
          </FormCard>
        </ContentWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default FailurePage;

// Estilos embutidos
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; 
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.mobileHeaderHeight};
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  font-size: 1.1rem;
  font-weight: 400;
  border: 1px solid #e0e0e0;
`;
