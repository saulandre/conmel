import React, { useEffect } from 'react';
import { Route, useNavigate, Routes } from 'react-router-dom';
import Login from './components/Unauthenticated/Login';
import Register from './components/Unauthenticated/Register';
import Verify from './components/Authenticated/VerificationCode';
import Dashboard from './components/Authenticated/Dashboard';
import Logout from './components/Authenticated/Logout';
import GlobalStyle from './styles/globalStyles';
import FormularioInscricao from './components/Authenticated/subscription';
import ForgotPassword from './components/Unauthenticated/ForgotPassword';
import NotFound from './components/Unauthenticated/NotFound';
import ProtectedRoute from './routes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/gestor');
    }
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <div className="container">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/novaconta" element={<Register />} />
            <Route path="/verificar" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
            <Route path="/gestor" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/inscricao" element={<ProtectedRoute><FormularioInscricao /></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
