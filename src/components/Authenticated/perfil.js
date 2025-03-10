import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FiUser, FiMail, FiPhone, FiLock, FiChevronLeft } from "react-icons/fi";
import InputMask from "react-input-mask";


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #403d39, #403d39);
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0rem;
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

  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
 
  margin-top: 1rem;
  margin-bottom: 1rem;
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

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const CheckboxGroup = styled.div`
  margin-top: 1.5rem; 
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Profile = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("usuario@exemplo.com"); // E-mail fixo
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [communication1, setCommunication1] = useState(false);
  const [communication2, setCommunication2] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados alterados
    console.log("Dados salvos");
  };

  return (
    <Container>
      <FormWrapper>
        <BackLink onClick={() => navigate(-1)}>
          <FiChevronLeft /> Voltar
        </BackLink>

        <FormCard onSubmit={handleSave}>
          <Header>
            <Title>Perfil</Title>
            <p style={{ color: "#666" }}>Atualize suas informações</p>
          </Header>

          <FormGrid>
            {/* Campos de Perfil */}
            <InputGroup>
              <InputLabel>
                <FiUser /> Nome Completo *
              </InputLabel>
              <InputField type="text" placeholder="Nome completo" required />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiMail /> E-mail *
              </InputLabel>
              <InputField 
                type="email" 
                value={email} 
                disabled
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiPhone /> Telefone
              </InputLabel>
              <InputMask
                mask="(99) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              >
                {(inputProps) => <InputField {...inputProps} />}
              </InputMask>
            </InputGroup>

            {/* Alteração de Senha */}
            <InputGroup>
              <InputLabel>
                <FiLock /> Senha Atual *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Digite sua senha atual" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiLock /> Nova Senha *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Digite sua nova senha" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiLock /> Confirmar Nova Senha *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Confirme sua nova senha" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </InputGroup>
          </FormGrid>

          {/* Checkboxes */}
          <CheckboxGroup>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={communication1} 
                onChange={() => setCommunication1(!communication1)} 
              />
              Aceito receber comunicações oficiais sobre a Confraternização das Mocidades Espíritas de Jacarepaguá.
            </CheckboxLabel>

            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={communication2} 
                onChange={() => setCommunication2(!communication2)} 
              />
              Aceito receber divulgações do movimento espírita jovem e artistico na região do Rio de Janeiro.
            </CheckboxLabel>
          </CheckboxGroup>

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
      </FormWrapper>
    </Container>
  );
};

export default Profile;
