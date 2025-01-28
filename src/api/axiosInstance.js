// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Base URL da API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
