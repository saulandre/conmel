// src/components/ServerStatus.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServerStatus = () => {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get('https://comejaca.org.br/api/health'); // ajuste se usar outra porta
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
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: online === null ? '#ccc' : online ? '#0d1b2a' : '#0d1b2a',
      color: '#fff',
      textAlign: 'center',
      padding: '6px 0',
      fontSize: '14px',
      zIndex: 9999,
    }}>
      {online === null ? 'Verificando status do servidor...' :
       online ? '✅ Servidor online' : '❌ Servidor offline'}
    </div>
  );
};

export default ServerStatus;
