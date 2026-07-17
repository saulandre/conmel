import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Unauthenticated/Login';
import Register from './components/Unauthenticated/Register';
import Verify from './components/Authenticated/VerificationCode';
import InstituicaoEspirita from './components/Authenticated/InstituicaoEspirita';
import Atualizar from './components/Authenticated/update';
import Perfil from './components/Authenticated/perfil';
import Dashboard from './components/Authenticated/Dashboard';
import GlobalStyle from './styles/globalStyles';
import FormularioInscricao from './components/Authenticated/subscription';
import FichaInscricao from './components/Authenticated/Print';
import NotFound from './components/Unauthenticated/NotFound';
import ProtectedRoute from './routes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import ServerStatus from './components/Unauthenticated/ServerStatus';
import SessaoInfo from './components/Unauthenticated/SessaoInfo';
import HeaderMain from './components/Authenticated/Header';
import Pagamentos from './components/Authenticated/Pagamentos.js';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globalStyles.css'; 
import PendingPage from './components/Authenticated/PendingPage';
import FailurePage from './components/Authenticated/FailurePage';
import SuccessPage from './components/Authenticated/SuccessPage';
import ListaParticipantes from './components/Authenticated/Status.js';
import NovaSenha from './components/Unauthenticated/NovaSenha.js';
import ForgotPassword from './components/Unauthenticated/ForgotPassword';
import RedirectRecuperarSenhaRoute from './components/Unauthenticated/RedirectRecuperarSenhaRoute';
import PasswordRecoveryErrorBoundary from './components/Unauthenticated/PasswordRecoveryErrorBoundary';
import AppErrorBoundary from './components/AppErrorBoundary';

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppErrorBoundary>{children}</AppErrorBoundary>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      
        style={{
          zIndex: 9999, 
          position: "fixed", 
          bottom: "35px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          zIndex: 9999   
        }}
      />

      <div className="container">
    {/*     <SessaoInfo /> */}
        <HeaderMain  className="no-print-header"/>

        <AuthProvider>
          <AppContent />
        </AuthProvider>

     <ServerStatus lassName="no-print-footer" /> 

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
      <Route
        path="/recuperarsenha"
        element={
          <PasswordRecoveryErrorBoundary>
            <ForgotPassword />
          </PasswordRecoveryErrorBoundary>
        }
      />
      <Route
        path="/recuperarsenha/route"
        element={
          <PasswordRecoveryErrorBoundary>
            <RedirectRecuperarSenhaRoute />
          </PasswordRecoveryErrorBoundary>
        }
      />
      <Route
        path="/novasenha"
        element={
          <PasswordRecoveryErrorBoundary>
            <NovaSenha />
          </PasswordRecoveryErrorBoundary>
        }
      />

      {/* Rotas Privadas */}
      <Route path="/verificar" element={<Verify />} />
      <Route path="/instituicao" element={<ProtectedPage><InstituicaoEspirita /></ProtectedPage>} />
      <Route path="/atualizar/:id" element={<ProtectedPage><Atualizar /></ProtectedPage>} />
      <Route path="/perfil" element={<ProtectedPage><Perfil /></ProtectedPage>} />
      <Route path="/painel" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
      <Route path="/inscrever" element={<AppErrorBoundary><FormularioInscricao /></AppErrorBoundary>} />
      <Route path="/falha" element={<ProtectedPage><FailurePage /></ProtectedPage>} />
      <Route path="/sucesso" element={<ProtectedPage><SuccessPage /></ProtectedPage>} />
      <Route path="/pendente" element={<ProtectedPage><PendingPage /></ProtectedPage>} />
      <Route path="/imprimir/:id" element={<ProtectedPage><FichaInscricao /></ProtectedPage>} />
      <Route path="/pagamentos" element={<ProtectedPage><ListaParticipantes /></ProtectedPage>} />
      <Route path="/enviar-comprovante" element={<ProtectedPage><Pagamentos /></ProtectedPage>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
