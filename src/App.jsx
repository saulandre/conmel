import React, { useEffect } from 'react';
import { Route, useNavigate, Routes, useLocation } from 'react-router-dom';
import Login from './components/Unauthenticated/Login';
import Register from './components/Unauthenticated/Register';
import Verify from './components/Authenticated/VerificationCode';
import InstituicaoEspirita from './components/Authenticated/InstituicaoEspirita';
import Perfil from './components/Authenticated/perfil';
import Dashboard from './components/Authenticated/Dashboard';
import GlobalStyle from './styles/globalStyles';
import FormularioInscricao from './components/Authenticated/subscription';
import ForgotPassword from './components/Unauthenticated/ForgotPassword';
import NotFound from './components/Unauthenticated/NotFound';
import ProtectedRoute from './routes/ProtectedRoutes';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="container">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </div>
    </>
  );
}

// Novo componente para conter a lógica de navegação
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Use o contexto de autenticação

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isVerified = user?.isVerified; // Supondo que o contexto forneça o estado de verificação

    if (token) {
      // Se o usuário estiver autenticado e o e-mail estiver ausente
      if (!user?.email) {
        navigate('/entrar'); // Redireciona para a página de login
      } else if (['/', '/entrar', '/registrar'].includes(location.pathname)) {
        // Se o usuário estiver autenticado e a rota for '/', '/entrar' ou '/registrar'
        // E se o usuário não for verificado, redireciona para '/verificar', caso contrário, vai para '/gestor'
        navigate(isVerified ? '/gestor' : '/verificar');
      }
    } else {
      if (location.pathname.startsWith('/gestor') || location.pathname === '/verificar') {
        // Se o usuário não estiver autenticado, redireciona para '/entrar'
        navigate('/entrar');
      }
    }
    
    
  }, [location.pathname, navigate, user?.isVerified]);

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/recuperarsenha" element={<ForgotPassword />} />
      <Route path="/verificar" element={<Verify />} />
      <Route path="/gestor" element={<Dashboard />} />
        <Route path="/inscrever" element={<FormularioInscricao />} />
        <Route path="/adicionarie" element={<InstituicaoEspirita />} />
        <Route path="/perfil" element={<Perfil />} />
      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
     
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;