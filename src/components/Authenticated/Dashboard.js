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
  FiMoon,
  FiLoader,
  FiAlertTriangle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Temas
const themes = {
  professional: {
    background: 'linear-gradient(135deg, #f8edeb, #403d39, #403d39)',
    cardBackground: '#e7ecef',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #403d39, #403d39)',
    tableHeaderBackground: '#403d39',
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
    tableRowHoverBackground: '#C0C0C0   ',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};

// Estilos
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden; // Novo

  @media (max-width: 768px) {
    padding: 0;
   
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
    border-radius: 5px;
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
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  width: 100%;
  max-width: calc(100vw - 2rem);
  margin: 0 auto;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    padding: 1rem;
    max-width: 100vw;
    width:100vw;
  
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
  border: 1px solid #ced4da;
  @media (min-width: 769px) {
    position: sticky;
    top: 2rem;
    border-radius: 5px;
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
  border-radius: 5px;

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
  border-radius: 5px;
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
  -webkit-overflow-scrolling: touch;
  border-radius: 5px;
  margin: 1rem 0;
  background: ${({ theme }) => theme.cardBackground};
  border: 2px solid #ced4da;
  @media (max-width: 768px) {
    border: 1px solid #000;
    margin: 1rem -1rem;
    width: calc(100% + 2rem);
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    border: none;
    background: transparent;
    box-shadow: none;
  }
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderColor};

  @media (max-width: 768px) {
    display: none;  /* Esconde o cabeçalho da tabela no mobile */
  }
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  position: relative;

  &:nth-child(even) {
    background-color: ${({ theme }) => theme.tableRowEvenBackground};
  }

  &:hover {
    background-color: ${({ theme }) => theme.tableRowHoverBackground};
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 1rem;
    background: ${({ theme }) => theme.cardBackground};
    border-radius: 0.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    &:nth-child(even) {
      background: ${({ theme }) => theme.cardBackground};
    }
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderColor};
  z-index: 2;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
  letter-spacing: 0.5px;

  &:first-child {
    border-radius: 0.5rem 0 0 0;
  }

  &:last-child {
    border-radius: 0 0.5rem 0 0;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.92em;
  color: #444;
  line-height: 1.4;

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: ${({ theme }) => theme.textColor};
      font-size: 0.85em;
      min-width: 100px;
      opacity: 0.9;
    }
  }
`;


const SmallButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5PX;
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
`;const Spin = styled.div`
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px;
  border-radius: 1rem;
  font-size: 0.85em;
  font-weight: 500;
  background: ${({ $status }) => {
    switch ($status) {
      case 'Aprovado': return '#e6f4ea';
      case 'Pendente': return '#fff3e6';
      case 'Rejeitado': return '#fde8e8';
      default: return '#f0f0f0';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'Aprovado': return '#0a5c36';
      case 'Pendente': return '#8a6500';
      case 'Rejeitado': return '#c22126';
      default: return '#666';
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;

    button {
      width: 100%;
      justify-content: center;
      padding: 0.4rem;
      font-size: 0.85em;
    }
  }
`;

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [theme, setTheme] = useState('professional');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
    
        const response = await axios.get(`${API_URL}/api/auth/obterinscricoes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log("Resposta da API:", response.data); // Depuração
        const role =  localStorage.getItem('role');
        if (role === 'admin') {
          setIsAdmin(true);
        }
        // Verifique se a resposta tem a propriedade "data" que é um array
        if (!Array.isArray(response.data.data)) {
          throw new Error('Resposta da API não contém um array válido');
        }
    
        setInscricoes(response.data.data); // Atualiza o estado com o array correto
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
        setError(error.response?.data?.error || 'Erro ao carregar inscrições');
        
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
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
    navigate('/');
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredData = Array.isArray(inscricoes) 
  ? inscricoes.filter(item => {
      const searchTerm = search.toLowerCase();
      return (
        item.nomeCompleto?.toLowerCase().includes(searchTerm) ||
        (item.numeroCMEJacas && item.numeroCMEJacas.includes(searchTerm)) ||
        (item.email && item.email.toLowerCase().includes(searchTerm))
      );
    })
  : [];
  
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
              <Title>INSCRIÇÕES 2025</Title>
              
              <MobileMenuWrapper>
                <MobileMenuButton onClick={toggleMenu}>
                  <FiMenu size={24} />
                </MobileMenuButton>
              </MobileMenuWrapper>

              <ButtonContainer>
                <ActionButton onClick={() => navigate('/inscrever')}>
                  <FiPlus size={18} /> Inscrever
                </ActionButton>
               
                <ActionButton onClick={() => navigate('/instituicao')}>
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
              <MobileMenuItem onClick={() => { navigate('/instituicao'); closeMenu(); }}>
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
                placeholder="Pesquisar por nome ou IE"
                value={search}
                onChange={handleSearch}
              />
            </SearchBoxContainer>
            {
  loading ? (
    <EmptyStateMessage>
      <Spin><FiLoader size={24} /></Spin>
      Carregando inscrições...
    </EmptyStateMessage>
  ) :  inscricoes.length === 0 ? (
    <EmptyStateMessage>
      <FiPlus size={24} />
      Estamos aguardando sua primeira inscrição
    </EmptyStateMessage>
  ) : filteredData.length === 0 ? (
    <EmptyStateMessage>
      <FiSearch size={24} />
      Nenhum resultado encontrado
    </EmptyStateMessage>
  ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeaderCell>#</TableHeaderCell>
                      <TableHeaderCell>NOME COMPLETO</TableHeaderCell>
                 
                      <TableHeaderCell>STATUS</TableHeaderCell>
                      <TableHeaderCell>DATA</TableHeaderCell>
                      <TableHeaderCell>AÇÕES</TableHeaderCell>
                    </tr>
                  </TableHead>
                  <tbody>
                  {filteredData.map((item, index) => (
  <TableRow key={item.id}>
    <TableCell data-label="#">{index + 1}</TableCell>
    <TableCell data-label="Nome Completo">{item.nomeCompleto}</TableCell>
   
    <TableCell data-label="Status">
      <StatusPill $status={item.status}>{item.status || 'Pendente'}</StatusPill>
    </TableCell>
    <TableCell data-label="Data">
      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
    </TableCell>
    <TableCell data-label="Ações">
      <ButtonGroup>
        <SmallButton onClick={() => navigate(`/edit/${item.id}`)}>
          <FiEdit size={14} /> Editar
        </SmallButton>
        <SmallButton onClick={() => navigate(`/print/${item.id}`)}>
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