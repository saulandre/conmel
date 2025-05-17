import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const TextInput = styled.input`
  width: 200px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: #6599FF;
  }
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 900px;

  @media(min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: #1f2937;
`;

const QRImage = styled.img`
  width: 160px;
  height: 160px;
  margin-bottom: 1.5rem;
  object-fit: contain;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const PixInput = styled.input`
  width: 100%;
  font-size: 0.75rem;
  padding: 0.5rem;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  user-select: all;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6599FF;
    background: #fff;
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-top: 2.5rem;
  margin-bottom: 0.5rem;
`;

const StrongText = styled.strong`
  color: #111827;
`;

const FileInput = styled.input`
  width: 200px;
  margin-bottom: 0.5rem;
`;

const SendButton = styled.button`
  width: 200px;
  background-color: ${props => (props.disabled ? '#6599FF' : '#6599FF')};
  color: white;
  padding: 0.75rem;
  border: none;
  margin-top: 50px;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${props => (props.disabled ? '#f39c12' : '#f39c12')};
  }
`;

const FeedbackMessage = styled.p`
  font-size: 0.9rem;
  margin-top: 1rem;
  color: ${props => (props.error ? '#dc2626' : '#16a34a')};
  font-weight: 600;
  min-height: 24px;
`;

const PaymentPage = () => {
 const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [name, setName] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFeedback(null); // limpa feedback quando troca arquivo
  };

const handleSend = async () => {
  if (!file || !name.trim()) {  // Verifica se o nome não está vazio
    setFeedback({ error: true, message: "Preencha todos os campos corretamente!" });
    return;
  }

  setSending(true);
  setFeedback(null);

  try {
    const formData = new FormData();
    formData.append("nome", name.trim());  // Remove espaços extras
    formData.append("comprovante", file);

        const response = await axios.post(`${API_URL}/api/auth/enviar-comprovante`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Adicione se necessário:
          // "Authorization": `Bearer ${token}`
        },
        timeout: 10000 // 10 segundos timeout
      }
    );

    if (response.data.success) {
      setFeedback({ 
        error: false, 
        message: "Enviado com sucesso! Aguarde confirmação." 
      });
      // Reset mais completo
      document.getElementById("fileInput").value = ""; // Limpa o input file
      setFile(null);
      setName("");
    }
  } catch (error) {
    let errorMessage = "Erro ao enviar comprovante";
    
    if (error.response) {
      // Erros 4xx/5xx
      errorMessage = error.response.data?.message || 
                   error.response.data?.error || 
                   "Erro no servidor";
    } else if (error.request) {
      // Sem resposta do servidor
      errorMessage = "Sem resposta do servidor - verifique sua conexão";
    }
    
    setFeedback({ error: true, message: errorMessage });
  } finally {
    setSending(false);
  }
};

  return (
    <Container>
      <Title>PAGAMENTO DA INSCRIÇÃO</Title>

      <CardsGrid>
        <Card>
          <CardTitle>Inscrição sem Camisa R$ 50,00</CardTitle>
          <QRImage src="/qrcode50.png" alt="QR Code Inscrição sem Camisa" />
          <Label>PIX Copia e Cola</Label>
          <PixInput
            readOnly
            value="00020126430014BR.GOV.BCB.PIX012117ceu.ceerj@gmail.com520400005303986540550.005802BR5901N6001C6212050835CONMEL63049284"
            onFocus={(e) => e.target.select()}
          />
        </Card>

        <Card>
          <CardTitle>Inscrição com Camisa R$ 75,00</CardTitle>
          <QRImage src="/qrcode75.png" alt="QR Code Inscrição com Camisa" />
          <Label>PIX Copia e Cola</Label>
          <PixInput
            readOnly
            value="00020126360014BR.GOV.BCB.PIX0114+5521992733029520400005303986540575.005802BR5920Valeria Cid Carvalho6014Rio de Janeiro62070503***6304252B"
            onFocus={(e) => e.target.select()}
          />
        </Card>
      </CardsGrid>

      <InfoText>
        Chave PIX: <StrongText>17ceu.ceerj@gmail.com</StrongText> em nome de <StrongText>Valéria Cid Carvalho</StrongText>
      </InfoText>
      <br></br>
    <Label htmlFor="nameInput">Nome do Inscrito</Label>
      <TextInput
        id="nameInput"
        type="text"
        placeholder="Digite seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={sending}
      />
      <Label htmlFor="fileInput">Envie aqui seu comprovante de pagamento</Label>
      <FileInput
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        disabled={sending}
        accept="image/*,.pdf"
      />
      {file && <InfoText>Arquivo selecionado: <StrongText>{file.name}</StrongText></InfoText>}

      <SendButton
        disabled={!file || sending}
        onClick={handleSend}
      >
        {sending ? "Enviando..." : "Enviar comprovante"}
      </SendButton>

      <FeedbackMessage error={feedback?.error}>
        {feedback?.message || "\u00A0" /* espaço para manter altura */}
      </FeedbackMessage>
    </Container>
  );
};

export default PaymentPage;
