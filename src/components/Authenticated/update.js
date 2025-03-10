import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FiUser, FiMail, FiMapPin, FiCalendar, FiInfo, FiPhone, FiChevronLeft, FiFileText, FiShoppingBag, FiLoader } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import axios from 'axios';
import { ArrowLeft } from "react-feather";
// Estilos (mantenha os mesmos do seu código original)
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #403d39, #f8edeb, #403d39);
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 0;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const FormCard = styled.form`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 0rem;
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
  margin-top: 1rem;

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
    border: 1px solid #ddd;
    
    &:hover {
      border-color: #4a4e69;
    }
    
    &:focus-within {
      border-color: #4a4e69;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #403d39, #403d39);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const Atualizacao = () => {

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    tipoParticipacao: '',
    nomeCompletoResponsavel: '',
    documentoResponsavel: '',
    telefoneResponsavel: '',
    comissao: '',
    camisa: false,
    tamanhoCamisa: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',

    medicacao: '',
    alergia: '',
    outrasInformacoes: '',
    IE: '',
    vegetariano: '',
    nomeSocial: '',

  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isMinor, setIsMinor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token não encontrado, redirecionando para /entrar");
      navigate("/entrar");
      return;
    }

    const fetchInstitutions = async () => {
      try {
        console.log("Buscando instituições...");
        const response = await axios.get(`${API_URL}/api/auth/instituicoes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Instituições carregadas:", response.data);
        setInstitutions(response.data);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
        if (error.response?.status === 401) {
          console.log("Token inválido ou expirado, redirecionando para /entrar");
          navigate("/entrar");
        }
      }
    };

    fetchInstitutions();
  }, [navigate, API_URL]);

  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    console.log(`Campo alterado: ${name} = ${type === 'checkbox' ? checked : value}`);
  
    let formattedValue = value;
  
    // Remover caracteres não numéricos apenas se o campo for CPF, RG ou telefone
    if (name === "documentoResponsavel" || name === "telefone" || name === "telefoneResponsavel") {
      // Limita caracteres não numéricos
      formattedValue = value.replace(/\D/g, "");
    }
  
    // Se o campo for telefone ou telefoneResponsavel, formatar
    if (name === "telefone" || name === "telefoneResponsavel") {
      formattedValue = formatPhone(value); // Certifique-se de que formatPhone esteja corretamente implementada
    }
  
    // Formatar CPF ou RG para documentoResponsavel
    if (name === "documentoResponsavel") {
      if (formattedValue.length === 11) {
        // Aplicar máscara de CPF (XXX.XXX.XXX-XX)
        formattedValue = formattedValue.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        );
      } else if (formattedValue.length >= 9 && formattedValue.length <= 10) {
        // Aplicar máscara de RG (XX.XXX.XXX-XX)
        formattedValue = formattedValue.replace(
          /(\d{2})(\d{3})(\d{3})(\d{2})?/,
          (match, p1, p2, p3, p4) => {
            return p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`;
          }
        );
      }
  
      // Limitar o tamanho do documento (não deve passar de 14 caracteres formatados)
      if (formattedValue.replace(/\D/g, "").length > 11) {
        formattedValue = formattedValue.substring(0, 14); // Máximo de caracteres visíveis (CPF ou RG)
      }
    }
  
    // Atualizar o estado com o valor formatado
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };
  
  
  

  const handleDateChange = (date) => {
    console.log("Data de nascimento selecionada:", date);
    setFormData(prev => ({
      ...prev,
      dataNascimento: date,
      ...(calculateAge(date) >= 18 && {
        nomeCompletoResponsavel: '',
        documentoResponsavel: '',
        telefoneResponsavel: ''
      })
    }));
    setIsMinor(calculateAge(date) < 18);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Iniciando envio do formulário...");
    setIsSubmitting(true);
    setErrors([]);

    try {
      const token = localStorage.getItem("token");
      console.log("Token JWT encontrado:", token);

    // Validação da data de nascimento
    const dataNascimento = new Date(formData.dataNascimento);
    if (isNaN(dataNascimento.getTime())) {
      console.error("Data de nascimento inválida:", formData.dataNascimento);
      setErrors([{ message: "Data de nascimento inválida." }]);
      return;
    }

      const payload = {
        ...formData,
        comissao: String(formData.comissao), 
        dataNascimento: dataNascimento.toISOString().split('T')[0],
        telefone: formData.telefone.replace(/\D/g, ''),
        documentoResponsavel: formData.documentoResponsavel?.replace(/\D/g, ''),
        telefoneResponsavel: formData.telefoneResponsavel?.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, '')
      };

      console.log("Payload preparado para envio:", payload);

      const response = await axios.post(`${API_URL}/api/auth/inscrever`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Resposta do backend:", response.data);

      if (response.data.success) {
        console.log("Inscrição salva com sucesso, redirecionando para /confirmacao");
        navigate('/confirmacao', { state: response.data });
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      console.log("Detalhes do erro:", error.response?.data);
      setErrors(error.response?.data.details || [{ message: 'Erro ao salvar inscrição' }]);
    } finally {
      console.log("Finalizando processo de envio");
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value) => {
    if (!value) return "";
    
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, "");
  
    // Formata como telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (cleaned.length > 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length > 2) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
      return cleaned;
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setFormData((prevState) => ({ ...prevState, cep }));
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prevState) => ({
            ...prevState,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        } else {
          alert("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Container>
        <FormWrapper>
   

          <FormCard onSubmit={handleSubmit}>
            
            <Header>
              <Title>FORMULÁRIO DE INSCRIÇÃO 2025</Title>
              <p style={{ color: '#666' }}>Todos os campos marcados com * são obrigatórios</p>
              {errors.length > 0 && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                  {errors.map((err, index) => (
                    <div key={index}>⚠️ {err.message}</div>
                  ))}
                </div>
              )}
            </Header>

            <FormGrid>
              {/* Campos Pessoais */}
              <InputGroup>
                <InputLabel><FiUser /> Nome Completo *</InputLabel>
                <InputField
                  name="nomeCompleto"
                  placeholder="Digite seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                />
              </InputGroup>


              <InputGroup>
                <InputLabel><FiUser /> Nome social</InputLabel>
                <InputField
                  name="nomeSocial"
                  placeholder="Digite seu nome social"
                  value={formData.nomeSocial}
                  onChange={handleChange}
                  required
                />
              </InputGroup>


              <InputGroup>
                <InputLabel><FiCalendar /> Data de Nascimento *</InputLabel>
                <StyledDatePicker
                  value={formData.dataNascimento}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  
                  required
                />
              </InputGroup>

              {isMinor && (
                <>
                  <InputGroup>
                    <InputLabel><FiUser /> Nome do Responsável *</InputLabel>
                    <InputField
                      name="nomeCompletoResponsavel"
                      value={formData.nomeCompletoResponsavel}
                      onChange={handleChange}
                      
                    />
                  </InputGroup>

                  <InputGroup>
  <InputLabel><FiFileText /> Documento do Responsável *</InputLabel>
  <InputField
    name="documentoResponsavel"
    value={formData.documentoResponsavel || ""}
    onChange={handleChange}
    placeholder="Digite o documento do responsável"
    maxLength={14} 
  />
</InputGroup>


                  <InputGroup>
                    <InputLabel><FiPhone /> Telefone do Responsável *</InputLabel>
                    <InputField
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      placeholder="Digite o telefone do responsável"
               
             
                      
                      
                    />
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <InputLabel><FiUser /> Sexo *</InputLabel>
                <Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLabel><FiPhone /> Telefone *</InputLabel>
                <InputField
         name="telefone"
         value={formData.telefone}
         onChange={handleChange}
         placeholder="Digite seu telefone"
         required

                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMail /> E-mail *</InputLabel>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@dominio.com"
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiShoppingBag /> Deseja camisa? </InputLabel>
                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    name="camisa"
                    checked={formData.camisa}
                    onChange={handleChange}
                  />
                  <CheckboxLabel>Sim, desejo comprar a camisa</CheckboxLabel>
                </CheckboxContainer>
              </InputGroup>

              {formData.camisa && (
                <InputGroup>
                  <InputLabel>Tamanho da Camisa *</InputLabel>
                  <Select
                    name="tamanhoCamisa"
                    value={formData.tamanhoCamisa}
                    onChange={handleChange}
                    
                  >
                    <option value="">Selecione</option>
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </Select>
                </InputGroup>
              )}

              <InputGroup>
                <InputLabel>Tipo de Participação *</InputLabel>
                <Select
                  name="tipoParticipacao"
                  value={formData.tipoParticipacao}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Confraternista">Confraternista</option>
                  <option value="Trabalhador">Trabalhador</option>
                </Select>
              </InputGroup>

              {formData.tipoParticipacao === 'Trabalhador' && (
                <InputGroup>
                  <InputLabel>Comissão *</InputLabel>
                  <Select
                    name="comissao"
                    value={formData.comissao}
                    onChange={handleChange}
                    
                  >
                    <option value="">Selecione</option>
                    <option value="Recepcao">Recepção</option>
                    <option value="Logistica">Logística</option>
                    <option value="Alimentacao">Alimentação</option>
                  </Select>
                </InputGroup>
              )}

              {/* Endereço */}
              <InputGroup>
                <InputLabel><FiMapPin /> CEP *</InputLabel>
                <InputField
                  name="cep"
                  value={formData.cep}
                  placeholder="Digite seu CEP"
                  onChange={handleCepChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Estado *</InputLabel>
                <InputField
                  name="estado"
       
                  disabled
                  value={formData.estado}
              onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Cidade *</InputLabel>
                <InputField
                  name="cidade"
                  disabled
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Bairro *</InputLabel>
                <InputField
                  name="bairro"
                  disabled
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Logradouro *</InputLabel>
                <InputField
                  name="logradouro"
                  disabled
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Número *</InputLabel>
                <InputField
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Complemento</InputLabel>
                <InputField
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Instituição Espírita *</InputLabel>
                <Select
                  name="IE"
                  value={formData.IE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.nome}>{inst.nome}</option>
                  ))}
                </Select>
              </InputGroup>
              <InputGroup>
                <InputLabel>
                  <FiInfo /> Vegetarianismo *
                </InputLabel>
                <Select         name="vegetariano"
        
                  value={formData.vegetariano}
                  onChange={handleChange}
                  required>
                  <option value="">Faz dieta vegetariana?</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </Select>
              </InputGroup>
              {/* Informações Adicionais */}
              <InputGroup>
                <InputLabel><FiInfo /> Alergias</InputLabel>
                <TextArea
                  name="alergia"
                  placeholder="Descreva suas alergias."
                  value={formData.alergia}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiInfo /> Medicação</InputLabel>
                <TextArea
                  name="medicacao"
                  placeholder="Descreva medicações em uso."
                  value={formData.medicacao}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiInfo /> Observações</InputLabel>
                <TextArea
                  name="outrasInformacoes"
                  placeholder="Informações adicionais sobre esta inscrição."
                  value={formData.outrasInformacoes}
                  onChange={handleChange}
                />
              </InputGroup>

        
            </FormGrid>
            <CheckboxContainer>
                <CheckboxInput
                  type="checkbox"
   
                  required
                />
                <CheckboxLabel>
                Declaro que li o plano geral e aceito o plano geral da XLVI COMEJACA. *

                </CheckboxLabel>
              </CheckboxContainer>
            <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiLoader className="spin" />
                    Salvando...
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiFileText />
                    Atualizar inscrição
                  </div>
                )}
              </SubmitButton>
          </FormCard>
        </FormWrapper>
      </Container>
    </LocalizationProvider>
  );
};

export default Atualizacao;