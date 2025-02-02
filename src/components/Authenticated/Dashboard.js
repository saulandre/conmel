import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiPrinter, FiPlus, FiUpload, FiDownload, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4a4e69, #22223b);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s, opacity 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.8rem;
  }
`;

const SearchBoxContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 1rem;
  margin-top: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    pointer-events: none;
  }

  @media (max-width: 768px) {
    overflow-x: unset;
    &::after {
      display: none;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    min-width: unset;
  }
`;

const TableHead = styled.thead`
  background: #4a4e69;
  color: white;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f3f5;
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.8rem;
    padding: 1rem;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem 1.5rem;
  font-weight: 600;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    display: block;
    text-align: right;
    padding: 0.8rem 1rem;
    border-bottom: none;

    &::before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      color: #4a4e69;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;

  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 1rem;
  }
`;

const SmallButton = styled.button`
  background: linear-gradient(135deg, #4a4e69, #22223b);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  transition: transform 0.3s, opacity 0.3s;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

// Dados de exemplo
const data = [
  { id: 1, name: 'João Silva', institution: 'Centro Espírita Caminho da Luz' },
  { id: 2, name: 'Maria Oliveira', institution: 'Grupo Espírita Paz e Amor' },
  { id: 3, name: 'Carlos Souza', institution: 'Sociedade Espírita Esperança' },
  { id: 4, name: 'Ana Costa', institution: 'Casa Espírita Nova Vida' },
];

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    navigate('/entrar');
  };

  const novaInscricao = () => {
    navigate('/inscrever');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <ContentWrapper>
        <FormCard>
          <Header>
            <Title>Controle de Inscrições</Title>
            <ButtonContainer>
              <ActionButton onClick={novaInscricao}>
                <FiPlus size={18} /> Inscrever
              </ActionButton>
              <ActionButton onClick={() => navigate('/adicionarie')}>
                <FiUpload size={18} /> IE
              </ActionButton>
              <ActionButton>
                <FiDownload size={18} /> Materiais
              </ActionButton>
              <ActionButton onClick={() => navigate('/perfil')}>
                <FiUser size={18} /> Perfil
              </ActionButton>
              <ActionButton onClick={handleLogout}>
                <FiLogOut size={18} /> Sair
              </ActionButton>
            </ButtonContainer>
          </Header>

          <SearchBoxContainer>
            <SearchIcon size={20} />
            <SearchBox
              type="text"
              placeholder="Pesquisar por nome ou instituição..."
              value={search}
              onChange={handleSearch}
            />
          </SearchBoxContainer>

          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell>Nome Completo</TableHeaderCell>
                  <TableHeaderCell>Instituição</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </tr>
              </TableHead>
              <tbody>
                {filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell data-label="#">{index + 1}</TableCell>
                    <TableCell data-label="Nome Completo">{item.name}</TableCell>
                    <TableCell data-label="Instituição">{item.institution}</TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <SmallButton>
                          <FiEdit size={16} /> Editar
                        </SmallButton>
                        <SmallButton>
                          <FiPrinter size={16} /> Imprimir
                        </SmallButton>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

export default Dashboard;