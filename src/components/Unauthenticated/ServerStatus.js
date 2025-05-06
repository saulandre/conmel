// src/components/ServerStatus.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styled from 'styled-components';

const ServerStatusBar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #6599FF;
  color: #fff;
  text-align: center;
  padding: 6px 0;
  font-size: 14px;
  z-index: 9999;

  @media print {
    display: none !important;
  }
`;


const ServerStatus = ({className })  => {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const baseURL =
        window.location.hostname === 'localhost'
          ? 'http://localhost:4000'
          : 'https://colmel-back-production.up.railway.app';
      
      const response = await axios.get(`${baseURL}/api/health`, {
        withCredentials: true,
      });
     

        if (response.status === 200) {
          setOnline(true);
        }
      } catch (error) {
        setOnline(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000); // atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  return (
<ServerStatusBar>
  {online === null ? 'Verificando status do servidor...' :
   online ? '✅ Servidor online' : '❌ Servidor offline'}
</ServerStatusBar>
  );
};

export default ServerStatus;
