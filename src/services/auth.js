import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Importando o Axios configurado
import '../Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Atualiza os valores do formulário
   * @param {Object} e - Evento do input
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    console.log(`Campo ${name} alterado para: ${type === 'checkbox' ? checked : value}`); // Adicionando log para monitorar as mudanças
  };

  /**
   * Realiza o login do usuário
   * @param {Object} e - Evento do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulário enviado com os dados:', formData); // Verificando os dados enviados pelo formulário

    if (!formData.email || !formData.password) {
      setError('Todos os campos são obrigatórios.');
      console.log('Erro: Campos obrigatórios não preenchidos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fazer o login
      const response = await axiosInstance.post('/auth/login', formData);
      console.log('Resposta da API:', response.data); // Verificando o que está sendo retornado da API

      const { token, user } = response.data;

      // Armazenar o token no localStorage
      localStorage.setItem('token', token);
      console.log("Token armazenado:", localStorage.getItem('token')); // Verificando se o token foi armazenado corretamente

      // Configurar expiração se "Manter Conectado" estiver marcado
      if (formData.rememberMe) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        localStorage.setItem('tokenExpiration', expirationDate.toISOString());
        console.log('Token expirará em:', expirationDate.toISOString()); // Log da data de expiração
      }

      // Definir redirecionamento após o login
      if (!user.isVerified) {
        console.log("Redirecionando para a página de verificação");
        setLoading(false); // Garantir que o loading seja desativado antes de redirecionar
        navigate('/verify'); // Página de verificação
      } else {
        console.log("Redirecionando para o dashboard");
        setLoading(false); // Garantir que o loading seja desativado antes de redirecionar
        navigate('/dashboard'); // Dashboard
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login.');
      console.log('Erro ao fazer login:', err.response?.data?.error || err.message); // Log do erro de login
      setLoading(false); // Garantir que o loading seja desativado em caso de erro
    }
  };

  // Garantir que o navigate seja chamado após o setState de loading ou error
  useEffect(() => {
    if (!loading && error) {
      console.log('Erro no login:', error); // Verificando erro no login
    }
  }, [loading, error]); // Dependências para monitorar mudanças em loading e error

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Senha"
          required
        />
        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe">Manter Conectado</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
