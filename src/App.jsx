import React from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Unauthenticated/Login';
import Register from './components/Unauthenticated/Register';
import Verify from './components/Authenticated/VerificationCode';
import InstituicaoEspirita from './components/Authenticated/InstituicaoEspirita';
import Atualizacao from './components/Authenticated/update';
import Perfil from './components/Authenticated/perfil';
import Dashboard from './components/Authenticated/Dashboard';
import GlobalStyle from './styles/globalStyles';
import FormularioInscricao from './components/Authenticated/subscription';
import Print from './components/Authenticated/Print';
import ForgotPassword from './components/Unauthenticated/ForgotPassword';
import NotFound from './components/Unauthenticated/NotFound';
import ProtectedRoute from './routes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';

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

function AppContent() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
  
      <Route path="/registrar" element={<Register />} />
      <Route path="/recuperarsenha" element={<ForgotPassword />} />
      <Route path="/verificar" element={<Verify />} />

      {/* Rotas Protegidas */}
      <Route
        path="/gestor"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inscrever"
        element={
          <ProtectedRoute>
            <FormularioInscricao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instituicao"
        element={
          <ProtectedRoute>
            <InstituicaoEspirita />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />



<Route
  path="/atualizacao/:id"
  element={
    <ProtectedRoute>
      <Atualizacao />
    </ProtectedRoute>
  }
/>

<Route
  path="/print/:id"
  element={
    <ProtectedRoute>
      <Print />
    </ProtectedRoute>
  }
/>


      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
