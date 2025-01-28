import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEdit, FiPrinter } from 'react-icons/fi';

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: auto;
  font-family: Arial, sans-serif;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background-color: #4a4e69;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  flex: 1;

  &:hover {
    background-color: #22223b;
  }

  @media (max-width: 768px) {
    flex: none;
    width: 100%; /* Botões ocupam toda a largura no mobile */
  }
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const TableHead = styled.thead`
  background-color: #4a4e69;
  color: white;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #ddd;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 15px;
  border: 1px solid #ddd;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SmallButton = styled.button`
  background-color: #4a4e69;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;

  &:hover {
    background-color: #22223b;
  }
`;

const data = [
  { id: 1, name: 'João Silva', institution: 'Centro Espírita Caminho da Luz' },
  { id: 2, name: 'Maria Oliveira', institution: 'Grupo Espírita Paz e Amor' },
  { id: 3, name: 'Carlos Souza', institution: 'Sociedade Espírita Esperança' },
  { id: 4, name: 'Ana Costa', institution: 'Casa Espírita Nova Vida' },
];

const App = () => {
  const [search, setSearch] = useState('');

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
      {/* Botões acima da barra de pesquisa */}
      <ButtonContainer>
        <ActionButton>Inscrever</ActionButton>
        <ActionButton>Materiais de Divulgação</ActionButton>
        <ActionButton>Sair</ActionButton>
      </ButtonContainer>

      {/* Barra de pesquisa */}
      <SearchBox
        type="text"
        placeholder="Pesquisar por nome ou instituição..."
        value={search}
        onChange={handleSearch}
      />

      {/* Tabela */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Nome Completo</TableHeaderCell>
              <TableHeaderCell>Instituição Espírita</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.institution}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <SmallButton>
                      <FiEdit /> Editar
                    </SmallButton>
                    <SmallButton>
                      <FiPrinter /> Imprimir
                    </SmallButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
