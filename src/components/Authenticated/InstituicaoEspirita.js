import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiArrowLeft, FiEdit, FiPlus, FiChevronLeft } from 'react-icons/fi';
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
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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

const Select = styled.select`
  width: 100%;
  padding: 1rem;
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

  @media (max-width: 768px) {
    overflow-x: unset;
    margin-top: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;

const TableHead = styled.thead`
  background: #4a4e69;
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
  text-align: left;

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

const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: opacity 0.3s;
  cursor: pointer;
  width: fit-content;

  &:hover {
    opacity: 0.8;
  }
`;


const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #4a4e69, #22223b);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const IePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/entrar");
    }
  }, [navigate]);

  const [institutions, setInstitutions] = useState([]); 
  const [selectedInstitution, setSelectedInstitution] = useState(null); 
  
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ie');
        setInstitutions(response.data);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
      }
    };
    fetchInstitutions();
  }, []);

 

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const institution = institutions.find((inst) => inst.id === selectedId);
    setSelectedInstitution(institution || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'adicionar') {
        await axios.post('http://localhost:4000/api/ie', formData);
        alert('Instituição adicionada com sucesso!');
      } else if (formMode === 'alterar' && selectedInstitution) {
        await axios.put(`http://localhost:4000/api/ie/${selectedInstitution.id}`, formData);
        alert('Instituição atualizada com sucesso!');
      }
      setFormMode(''); 
      setSelectedInstitution(null); 
    } catch (error) {
      console.error('Erro ao salvar instituição:', error);
      alert('Erro ao salvar instituição.');
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  const handleModeChange = (mode) => {
    setFormMode(mode);
    setSelectedInstitution(null);
  };

  return (
    <Container>
      <ContentWrapper>
         <BackLink onClick={() => navigate(-1)}>
                  <FiChevronLeft /> Voltar
                </BackLink>
        <FormCard>
          <Header>
            <Title>Cadastro de Instituição Espírita</Title>
            <ButtonContainer>
            {/*   <ActionButton onClick={handleBack}>
                <FiArrowLeft size={18} /> Voltar
              </ActionButton> */}
              <ActionButton onClick={() => handleModeChange('adicionar')}>
                <FiPlus size={18} /> Adicionar
              </ActionButton>
              <ActionButton onClick={() => handleModeChange('alterar')}>
                <FiEdit size={18} /> Alterar
              </ActionButton>
            </ButtonContainer>
          </Header>

          {formMode === 'alterar' && (
            <Select onChange={handleSelectChange}>
              <option value="">Selecione uma instituição</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nome}
                </option>
              ))}
            </Select>
          )}

          <TableContainer>
        
          </TableContainer>

          <div style={{ display: "flex", gap: "1rem", marginTop: "25px" }}>
  <SubmitButton type="submit">Salvar</SubmitButton>
  <SubmitButton 
    type="button" 
    onClick={() => navigate(-1)} 
    style={{ background: "#888" }}
  >
    Voltar
  </SubmitButton>
</div>
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

export default IePage;
