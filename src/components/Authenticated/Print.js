import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";

import { jsPDF } from "jspdf"; 

const Container = styled.div`
  font-family: 'Inter', Arial, sans-serif;
  max-width: 210mm;
  min-height: 5rem;
  margin: 0 auto;
  padding: 40px 50px;
  background: #ffffff;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px #ccc solid;
  border-radius: 5px;
  margin:3px;

    box-shadow: none;
    padding: 20px; 
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;

  h1 {
    color: #1a1a1a;
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  h2 {
    color: #666;
    font-size: 15px;
    font-weight: 400;
    margin: 0;
  }
`;

const Section = styled.div`
  margin-bottom: 0;
`;

const SectionTitle = styled.h3`
  color: #000;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  margin:  10px 0;
  letter-spacing: 0.5px;
border-bottom:1px solid #e8e8e8;
  padding: 2px 0;


`;

// Animação do Spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Animação de Fade-In
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;



// Estilização do Spinner
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #a855f7;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Mensagem de Loading
const LoadingText = styled.p`
  margin-top: 15px;
  font-size: 1rem;
  color: #a855f7;
  font-weight: 600;
`;

// Wrapper do Loader
const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Estilização do Documento
const DocumentWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;

  text-align: left;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ResponsiveGrid = styled.div`


  margin-bottom: 0;
`;

const ResponsiveGridMenorIdade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

  margin-bottom: 0;
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 2px 0;


  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  color: #212529;
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 150px;
  padding-right: 2px;
`;

const FieldValue = styled.span`
  color: #1a1a1a;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: left;
  flex-grow: 1;
  margin-right: 1rem;
`;

const AuthorizationBox = styled.div`
  background: #f8f9fa;
  padding: 20px;
  margin: 40px 0;
  border-left: 3px solid #d9534f;
  border-radius: 4px;

  strong {
    display: block;
    color: #d9534f;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  @media print {
    display: none; 
  }
`;
const Button = styled.button`
  background-color: #003049;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    background-color: #335c80;
  }
`;

const Footer = styled.div`
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #e8e8e8;
  color: #666;
  font-size: 11px;
  text-align: center;
  line-height: 1.5;
`;
const GlobalStyle = styled.div`
  @media print {
    * {
      overflow: hidden !important; /* Remove o scroll na impressão */
      
  border: none; 
    }
    body {
      margin: 0;
      padding: 0;
    }
  }
`;
const fetchUserData = async (id) => {
    const token = getToken();
    if (!token) return null;
  
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await axios.get(`${API_URL}/api/auth/print/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return null;
    }
  };
  <GlobalStyle/>
  // Função segura para recuperar token
const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // Função para buscar dados do usuário
 
  // Função para calcular idade
  const calculateAge = (dateString) => {
    if (!dateString) return "Desconhecido";
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  
  const FichaInscricao = () => {
    const { id } = useParams();
    const [participant, setParticipant] = useState(null);

     const [isMobile, setIsMobile] = useState(false);
     const [loading, setLoading] = useState(true);
     const [documentData, setDocumentData] = useState(null);
  useEffect(() => {
    // Detecta se o usuário está em um dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetchUserData(id);
          setParticipant(response?.data || null);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
   const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    setTimeout(() => {
      setDocumentData("📄 Documento carregado com sucesso!");
      setLoading(false);
    }, 3000);
  }, []);
  // Função para baixar em PDF




  const handleDownloadPDF = () => {
    const ficha = document.getElementById("ficha-inscricao");  // O conteúdo HTML que você quer converter em PDF
    const botao = document.getElementById("botao-pdf");  // O botão que você quer esconder temporariamente

    // Esconde o botão durante a geração do PDF
    botao.style.display = 'none';
    // Criar uma nova instância do jsPDF
    const doc = new jsPDF('p', 'mm', 'a4');  // Formato A4, orientação retrato
  
    // Usando o método html do jsPDF para renderizar o conteúdo HTML diretamente no PDF
    doc.html(ficha, {
      callback: function (doc) {
        doc.save('ficha_inscricao.pdf');  // Salva o arquivo PDF gerado
        botao.style.display = 'block';
      },
    
      x: 15,  // Posição horizontal inicial
   
      width: 180,  // Largura do conteúdo (evitar cortar texto)
      windowWidth: 650  // Largura da janela (ajuste conforme necessário)
    });
  };
  
  
  
 
    if (loading) return <p>Carregando...</p>;
    if (!participant) return <p>Erro ao carregar usuário.</p>;
  
    const age = calculateAge(participant.dataNascimento);
    const isMinor = age < 18;
  
    return (



      <Container>

{loading ? (
        <LoaderWrapper>
          <Spinner />
          <LoadingText>Carregando documento...</LoadingText>
        </LoaderWrapper>
      ) : (  <DocumentWrapper id="ficha-inscricao">
        <Header>
          <h1>COMEJACA 2025</h1>
          <h2>Confraternização das Mocidades Espíritas de Jacarepaguá</h2>
        </Header>
  
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <ResponsiveGrid>
            <FieldRow>
              <FieldLabel>Nome Completo: </FieldLabel>
              <FieldValue>{participant.nomeCompleto}</FieldValue>
            </FieldRow>
  
            {participant.nomeSocial && (
              <FieldRow>
                <FieldLabel>Nome Social</FieldLabel>
                <FieldValue>{participant.nomeSocial}</FieldValue>
              </FieldRow>
            )}
  
            <FieldRow>
              <FieldLabel>Data de nascimento: </FieldLabel>
              <FieldValue>
                {new Date(participant.dataNascimento).toLocaleDateString()}{" "}
                <span style={{ color: "#999" }}>({age} anos)</span>
              </FieldValue>
            </FieldRow>
  
            <FieldRow>
              <FieldLabel>Sexo: </FieldLabel>
              <FieldValue>{participant.sexo}</FieldValue>
            </FieldRow>

          </ResponsiveGrid>
        </Section>
  
        <Section>
          <SectionTitle>Contato</SectionTitle>
          <ResponsiveGrid>
            <FieldRow>
              <FieldLabel>E-mail: </FieldLabel>
              <FieldValue>{participant.email}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Telefone: </FieldLabel>
              <FieldValue>
                {participant.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
              </FieldValue>
            </FieldRow>
          </ResponsiveGrid>
        </Section>
  
        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <ResponsiveGrid>
            <FieldRow>
              <FieldLabel>CEP:</FieldLabel>
              <FieldValue>{participant.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Estado: </FieldLabel>
              <FieldValue>{participant.estado}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Cidade: </FieldLabel>
              <FieldValue>{participant.cidade}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Bairro</FieldLabel>
              <FieldValue>{participant.bairro}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Endereço</FieldLabel>
              <FieldValue>
                {participant.logradouro}, {participant.numero}{" "}
                {participant.complemento && `- ${participant.complemento}`}
              </FieldValue>
            </FieldRow>
          </ResponsiveGrid>
        </Section>
  
        <Section>
          <SectionTitle>Participação</SectionTitle>
          <ResponsiveGrid>
          <FieldRow>
  <FieldLabel>Participação</FieldLabel>
  <FieldValue>
    {participant.tipoParticipacao === "Confraternista"
      ? "Confraternista"
      : participant.tipoParticipacao === "Trabalhador"
      ? `Comissão: ${participant.comissao}`
      : "N/A"}
  </FieldValue>
</FieldRow>
            <FieldRow>
              <FieldLabel>Camisa</FieldLabel>
              <FieldValue>{participant.camisa ? `Sim (Tamanho: ${participant.tamanhoCamisa})` : "Não"}</FieldValue>
            </FieldRow>
          </ResponsiveGrid>
        </Section>
  
        <Section>
          <SectionTitle>Informações de Saúde</SectionTitle>
          <ResponsiveGrid>
            <FieldRow>
              <FieldLabel>Vegetariano:</FieldLabel>
              <FieldValue>{participant.vegetariano}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Tem alergias:</FieldLabel>
              <FieldValue>{participant.alergia || "Nenhuma"}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Toma medicações:</FieldLabel>
              <FieldValue>{participant.medicacao || "Nenhuma"}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Possui deficiência? </FieldLabel>
              <FieldValue>{participant.medicacao || "Nenhuma"}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>Outras Informações</FieldLabel>
              <FieldValue>{participant.outrasInformacoes || "Nenhuma"}</FieldValue>
            </FieldRow>
          </ResponsiveGrid>
        </Section>
    <Section>
          <SectionTitle>Instituição Espírita</SectionTitle>
          <ResponsiveGrid>
            <FieldRow>
              <FieldLabel>Nome</FieldLabel>
         
              
              <FieldValue>{participant.IE}</FieldValue>
         
        
            </FieldRow>
       
          </ResponsiveGrid>
        </Section>
        {isMinor && (
          <AuthorizationBox>
            <strong>AUTORIZAÇÃO PARA MENORES</strong>
            <p>
              Eu, {participant.nomeCompletoResponsavel || "[Nome do Responsável]"}, portador(a) do{" "}
              {participant.documentoResponsavel || "[Documento]"}, autorizo expressamente a participação de{" "}
              {participant.nomeCompleto} no evento COMEJACA 2025.
            </p>
          </AuthorizationBox>
        )}
  
        <Footer>
          Documento gerado eletronicamente em {new Date().toLocaleDateString()}
          <br />
          Válido mediante confirmação pela coordenação geral
        </Footer>
          <ButtonContainer>
        {isMobile ? (
          <Button id="botao-pdf" onClick={handleDownloadPDF}>Baixar PDF</Button>
        ) : (
          <Button onClick={handlePrint}>Imprimir</Button>
        )}
      </ButtonContainer>

      </DocumentWrapper>
            )}
      </Container>
    );
  };
  
  export default FichaInscricao;