import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

const lightTheme = {
  background: "#ffffff",
  color: "#333333",
  inputBg: "#f9f9f9",
  inputBorder: "#cccccc",
  buttonBg: "#4caf50",
  buttonColor: "#ffffff",
};

const darkTheme = {
  background: "#121212",
  color: "#ffffff",
  inputBg: "#1e1e1e",
  inputBorder: "#333333",
  buttonBg: "#4caf50",
  buttonColor: "#ffffff",
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const Form = styled.form`
  background-color: ${({ theme }) => theme.inputBg};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.color};
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.color};
  resize: none;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.color};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonColor};
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleThemeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color};
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Formulario = () => {
  const [theme, setTheme] = useState(lightTheme);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Form>
          <ToggleThemeButton onClick={toggleTheme}>
            {theme === lightTheme ? <BsFillMoonFill /> : <BsFillSunFill />}
          </ToggleThemeButton>
          <Title>Formulário de Inscrição</Title>

          <Label>Nome Completo</Label>
          <Input type="text" placeholder="Digite seu nome completo" />

          <Label>Nome Social</Label>
          <Input type="text" placeholder="Digite seu nome social" />

          <Label>Data de Nascimento</Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data de nascimento"
            className="custom-datepicker"
          />

          <Label>Sexo</Label>
          <Select>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </Select>

          <Label>Telefone</Label>
          <Input type="tel" placeholder="Digite seu telefone" />

          <Label>E-mail</Label>
          <Input type="email" placeholder="Digite seu e-mail" />

          <Label>CEP</Label>
          <Input type="text" placeholder="Digite seu CEP" />

          <Label>Estado</Label>
          <Input type="text" placeholder="Digite seu estado" />

          <Label>Cidade</Label>
          <Input type="text" placeholder="Digite sua cidade" />

          <Label>Bairro</Label>
          <Input type="text" placeholder="Digite seu bairro" />

          <Label>Logradouro</Label>
          <Input type="text" placeholder="Digite seu logradouro" />

          <Label>Número</Label>
          <Input type="text" placeholder="Digite o número" />

          <Label>Complemento</Label>
          <Input type="text" placeholder="Digite o complemento (opcional)" />

          <Label>Quanto tempo frequenta a Instituição Espírita?</Label>
          <Input type="text" placeholder="Ex.: 1 ano, 2 meses..." />

          <Label>Já participou de COMEJACA's anteriores?</Label>
          <Select>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </Select>

          <Label>Possui alergia?</Label>
          <Textarea rows="3" placeholder="Descreva se possui alergias" />

          <Label>Toma medicação controlada?</Label>
          <Textarea rows="3" placeholder="Descreva se faz uso de medicação" />

          <Label>Faz uso de alimentação vegetariana?</Label>
          <Select>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </Select>

          <Label>Há algo mais que devemos saber sobre você?</Label>
          <Textarea rows="3" placeholder="Descreva algo importante" />

          <CheckboxContainer>
            <input type="checkbox" id="terms" />
            <CheckboxLabel htmlFor="terms">
              Li e aceito todas as normas
            </CheckboxLabel>
          </CheckboxContainer>

          <Button type="submit">Enviar</Button>
        </Form>
      </Container>
    </ThemeProvider>
  );
};

export default Formulario;
