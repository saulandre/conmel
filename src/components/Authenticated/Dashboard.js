import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { 
  FiEdit, 
  FiPrinter, 
  FiPlus, 
  FiUpload, 
  FiDownload, 
  FiUser, 
  FiLogOut, 
  FiSearch, 
  FiMenu,
  FiMoon
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Temas
const themes = {
  professional: {
    background: 'linear-gradient(135deg, #22223b, #335c67, #22223b)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #4a4e69, #22223b)',
    tableHeaderBackground: '#4a4e69',
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
    tableRowHoverBackground: '#f0f0f0',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};

// Estilos
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem 0 0 0;
  }
`;

const FloatingActions = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 0.5rem;
  z-index: 999;
  transition: all 0.3s ease;

  button {
    background: ${({ theme }) => theme.cardBackground};
    color: ${({ theme }) => theme.textColor};
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 768px) {
    top: ${({ $isMenuOpen }) => $isMenuOpen ? 'auto' : '80px'};
    bottom: ${({ $isMenuOpen }) => $isMenuOpen ? '20px' : 'auto'};
    right: 15px;
    flex-direction: row;
    
    button {
      width: 36px;
      height: 36px;
    }
  }
`;

const MobileMenuWrapper = styled.div`
  position: relative;
  z-index: 1001;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  font-size: 1.1rem;
  font-weight: 400;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #e0e0e0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.mobileHeaderHeight};

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.cardBackground};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);

  @media (min-width: 769px) {
    position: sticky;
    top: 2rem;
    border-radius: 0.5rem;
    margin: -2rem -2rem 2rem -2rem;
    width: calc(100% + 4rem);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  padding: 0.5rem;
  border-radius: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.cardBackground};
  padding: 1rem;
  z-index: 1001;
  display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: ${({ $isOpen }) => 
    $isOpen ? 'slideDown 0.3s ease' : 'slideUp 0.2s ease'};

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-20px); opacity: 0; }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  justify-content: center;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
  }
`;

const MobileMenuItem = styled(ActionButton)`
  font-size: 0.9rem;
  padding: 0.8rem;
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
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: #f9f9f9;
  color: #333;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #666;
    background: white;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderColor};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.tableRowEvenBackground};
  }

  &:hover {
    background-color: ${({ theme }) => theme.tableRowHoverBackground};
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  font-weight: 500;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const SmallButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// Componente Principal
const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [theme, setTheme] = useState('professional');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        const response = await axios.get('/api/inscricoes');
        setInscricoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
      }
    };

    fetchInscricoes();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'professional' ? 'minimalista' : 'professional'));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    navigate('/entrar');
  };

  const handleSearch = (e) => setSearch(e.target.value);



  return (
    <ThemeProvider theme={themes[theme]}>
      <Container>
        <FloatingActions $isMenuOpen={isMenuOpen}>
          <button onClick={toggleTheme} title="Alternar tema">
            <FiMoon size={20} />
          </button>
          <button onClick={handleLogout} title="Sair">
            <FiLogOut size={20} />
          </button>
        </FloatingActions>

        <ContentWrapper>
          <FormCard>
            <Header>
              <Title>Controle de Inscrições</Title>
              
              <MobileMenuWrapper>
                <MobileMenuButton onClick={toggleMenu}>
                  <FiMenu size={24} />
                </MobileMenuButton>
              </MobileMenuWrapper>

              <ButtonContainer>
                <ActionButton onClick={() => navigate('/inscrever')}>
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
              </ButtonContainer>
            </Header>

            <MobileMenu $isOpen={isMenuOpen}>
              <MobileMenuItem onClick={() => { navigate('/inscrever'); closeMenu(); }}>
                <FiPlus size={18} /> Inscrever
              </MobileMenuItem>
              <MobileMenuItem onClick={() => { navigate('/adicionarie'); closeMenu(); }}>
                <FiUpload size={18} /> IE
              </MobileMenuItem>
              <MobileMenuItem>
                <FiDownload size={18} /> Materiais
              </MobileMenuItem>
              <MobileMenuItem onClick={() => { navigate('/perfil'); closeMenu(); }}>
                <FiUser size={18} /> Perfil
              </MobileMenuItem>
            </MobileMenu>

            <SearchBoxContainer>
              <SearchIcon size={20} />
              <SearchBox
                type="text"
                placeholder="Pesquisar por nome ou instituição..."
                value={search}
                onChange={handleSearch}
              />
            </SearchBoxContainer>

            {inscricoes.length === 0 ? (
              <EmptyStateMessage>
                <FiPlus size={24} />
                Estamos aguardando sua primeira inscrição
              </EmptyStateMessage>
            ) : (
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
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.institution}</TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <SmallButton>
                              <FiEdit size={14} /> Editar
                            </SmallButton>
                            <SmallButton>
                              <FiPrinter size={14} /> Imprimir
                            </SmallButton>
                          </ButtonGroup>
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
    </ThemeProvider>
  );
};

export default Dashboard;