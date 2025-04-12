import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/pagamentos/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          setParticipantes(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, []);

  return (
    <Container>
      <ContentWrapper>
        <FormCard>
          <Header>
            <Title>HISTORICO DE PAGAMENTOS</Title>
          </Header>

          {loading ? (
            <p>Carregando participantes...</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>Instituição Espirita</TableHeaderCell>
                    <TableHeaderCell>Status Pagamento</TableHeaderCell>
                    <TableHeaderCell>Link</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {participantes.map((p, index) => (
                    <TableRow key={index}>
                      <TableCell>{p.nomeCompleto}</TableCell>
                      <TableCell>{p.IE}</TableCell>
                      <TableCell>{p.statusPagamento}</TableCell>
                      <TableCell>
                        {p.linkPagamento ? (
                          <a href={p.linkPagamento} target="_blank" rel="noopener noreferrer">
                            Acessar
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

export default ListaParticipantes;

// ==========================
// Styled Components abaixo
// ==========================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e7ecef, #e7ecef, #e7ecef);
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: #e7ecef;
  padding: 2.5rem;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 5px;
  margin-top: 1rem;
  border: #ccc solid 1px;

  @media (max-width: 768px) {
    overflow-x: unset;
    margin-top: 5px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableHead = styled.thead`
  background: #0d1b2a;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;
