import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ServerStatus from './components/Unauthenticated/ServerStatus';
import SessaoInfo from './components/Unauthenticated/SessaoInfo';
import HeaderMain from './components/Authenticated/Header';
import ChangePassword from './components/Unauthenticated/ChangePassword';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <HeaderMain />

        <AuthProvider>
          <AppContent />
        </AuthProvider>

        <ServerStatus />
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
      <Route path="/recuperarsenha/route" element={<ChangePassword />} />

      <Route path="*" element={<NotFound />} />

      {/* Rotas Privadas */}
      <Route path="/verificar" element={<Verify />} />
      <Route path="/instituicao" element={<ProtectedRoute><InstituicaoEspirita /></ProtectedRoute>} />
      <Route path="/atualizacao" element={<ProtectedRoute><Atualizacao /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inscrever" element={<ProtectedRoute><FormularioInscricao /></ProtectedRoute>} />
      <Route path="/imprimir" element={<ProtectedRoute><Print /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
