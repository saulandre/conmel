import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FiUser, FiMail, FiMapPin, FiCalendar, FiInfo, FiPhone, FiChevronLeft, FiFileText, FiShoppingBag } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #22223b, #335c67, #22223b);
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const FormCard = styled.form`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1rem;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #22223b;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
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

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  
  .MuiInputBase-root {
    padding: 1rem;
    color: #22223b;
    background: #f9f9f9;
    border-radius: 0.8rem;
    
    fieldset {
      border-color: #ddd;
    }
    
    &:hover fieldset {
      border-color: #4a4e69;
    }
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
  appearance: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  resize: vertical;
  min-height: 100px;
  font-family: 'Poppins', sans-serif;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #4a4e69;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #22223b;
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

const Formulario = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      navigate("/entrar");
    }
  }, [navigate]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isMinor, setIsMinor] = useState(false);
  const [wantsShirt, setWantsShirt] = useState(false);
  const [participationType, setParticipationType] = useState('');
  const [committee, setCommittee] = useState('');
  const [institutions, setInstitutions] = useState([]); // Estado para armazenar a lista de instituições
  const [selectedInstitution, setSelectedInstitution] = useState(''); // Estado para armazenar a instituição selecionada

  // Função para calcular a idade
  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Função para carregar a lista de instituições
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ie'); // Endpoint para buscar instituições
        setInstitutions(response.data);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
      }
    };

    fetchInstitutions();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsMinor(calculateAge(date) < 18);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Container>
        <FormWrapper>
          <BackLink onClick={() => navigate(-1)}>
            <FiChevronLeft /> Voltar
          </BackLink>

          <FormCard>
            <Header>
              <Title>FORMULÁRIO DE INSCRIÇÃO 2025</Title>
              <p style={{ color: '#666' }}>Todos os campos marcados com * são obrigatórios</p>
            </Header>

            <FormGrid>
              {/* Campos Pessoais */}
              <InputGroup>
                <InputLabel>
                  <FiUser /> Nome Completo *
                </InputLabel>
                <InputField type="text" placeholder="Digite seu nome completo" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiUser /> Nome Social
                </InputLabel>
                <InputField type="text" placeholder="Digite o nome social" />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiCalendar /> Data de Nascimento *
                </InputLabel>
                <StyledDatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  required
                />
              </InputGroup>

              {isMinor && (
                <>
                  <InputGroup>
                    <InputLabel>
                      <FiUser /> Nome do Responsável *
                    </InputLabel>
                    <InputField type="text" placeholder="Nome completo do responsável" required />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>
                      <FiFileText /> Documento do Responsável *
                    </InputLabel>
                    <InputField type="text" placeholder="Documento do responsável" required />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>
                      <FiPhone /> Telefone do Responsável *
                    </InputLabel>
                    <InputField type="tel" placeholder="Telefone do responsável" required />
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <InputLabel>
                  <FiUser /> Sexo *
                </InputLabel>
                <Select required>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </Select>
              </InputGroup>

              {/* Contato */}
              <InputGroup>
                <InputLabel>
                  <FiPhone /> Telefone *
                </InputLabel>
                <InputField type="tel" placeholder="Digite seu telefone" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMail /> E-mail *
                </InputLabel>
                <InputField type="email" placeholder="Digite seu e-mail" required />
              </InputGroup>

     

              {/* Participação */}
              <InputGroup>
                <InputLabel>
                  <FiShoppingBag /> Deseja camisa do evento? *
                </InputLabel>
                <CheckboxContainer>
                  <CheckboxInput 
                    type="checkbox" 
                    checked={wantsShirt}
                    onChange={(e) => setWantsShirt(e.target.checked)}
                  />
                  <CheckboxLabel>Sim, desejo comprar a camisa</CheckboxLabel>
                </CheckboxContainer>

                {wantsShirt && (
                  <InputGroup>
                    <InputLabel>Tamanho da Camisa *</InputLabel>
                    <Select required>
                      <option value="">Selecione o tamanho</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                    </Select>
                  </InputGroup>
                )}
              </InputGroup>

              <InputGroup>
                <InputLabel>Tipo de Participação *</InputLabel>
                <Select 
                  value={participationType} 
                  onChange={(e) => setParticipationType(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Confraternista">Confraternista</option>
                  <option value="Trabalhador">Trabalhador</option>
                </Select>
              </InputGroup>

              {participationType === 'Trabalhador' && (
                <InputGroup>
                  <InputLabel>Comissão de Trabalho *</InputLabel>
                  <Select 
                    value={committee} 
                    onChange={(e) => setCommittee(e.target.value)}
                    required
                  >
                    <option value="">Selecione a comissão</option>
                    <option value="Logística">Logística</option>
                    <option value="Acolhimento">Acolhimento</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Outra">Outra</option>
                  </Select>
                </InputGroup>
              )}

              {/* Endereço */}
              <InputGroup>
                <InputLabel>
                  <FiMapPin /> CEP *
                </InputLabel>
                <InputField type="text" placeholder="Digite seu CEP" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Estado *
                </InputLabel>
                <InputField type="text" placeholder="Digite seu estado" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Cidade *
                </InputLabel>
                <InputField type="text" placeholder="Digite sua cidade" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Bairro *
                </InputLabel>
                <InputField type="text" placeholder="Digite seu bairro" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Logradouro *
                </InputLabel>
                <InputField type="text" placeholder="Preeenchido automaticamente" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Número *
                </InputLabel>
                <InputField type="text" placeholder="Digite o número" required />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiMapPin /> Complemento
                </InputLabel>
                <InputField type="text" placeholder="Complemento (opcional)" />
              </InputGroup>
         {/* Instituição Espírita */}
         <InputGroup>
                <InputLabel>
                  <FiMapPin /> Instituição Espírita *
                </InputLabel>
                <Select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  required
                >
                  <option value="">Selecione uma instituição</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nome}
                    </option>
                  ))}
                </Select>
              </InputGroup>
              {/* Informações Adicionais */}
              <InputGroup>
                <InputLabel>
                  <FiInfo /> Tempo na Instituição
                </InputLabel>
                <InputField type="text" placeholder="Ex.: 2 anos, 3 anos..." />
              </InputGroup>



              <InputGroup>
                <InputLabel>
                  <FiInfo /> Participação Anterior *
                </InputLabel>
                <Select required>
                  <option value="">Já participou antes?</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiInfo /> Alergias
                </InputLabel>
                <TextArea rows="3" placeholder="Descreva suas alergias" />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiInfo /> Medicação
                </InputLabel>
                <TextArea rows="3" placeholder="Descreva medicações em uso" />
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiInfo /> Vegetarianismo *
                </InputLabel>
                <Select required>
                  <option value="">Faz dieta vegetariana?</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiInfo /> Observações
                </InputLabel>
                <TextArea rows="3" placeholder="Informações adicionais (se necessário)" />
              </InputGroup>
            </FormGrid>

            <CheckboxContainer>
              <CheckboxInput type="checkbox" id="terms" required />
              <CheckboxLabel htmlFor="terms">
                Li e aceito todas as normas *
              </CheckboxLabel>
            </CheckboxContainer>

            <SubmitButton type="submit">Enviar Inscrição</SubmitButton>
          </FormCard>
        </FormWrapper>
      </Container>
    </LocalizationProvider>
  );
};

export default Formulario;