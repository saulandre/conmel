import axios from 'axios';
import { getApiBaseUrl } from '../config/api';
import { getStoredRole } from './safeStorage';

/**
 * Consulta se as inscrições públicas estão abertas.
 * Em falha de rede, assume encerrado (fail-closed).
 */
export async function fetchPublicRegistrationsOpen() {
  try {
    const apiBase = getApiBaseUrl();
    const { data } = await axios.get(`${apiBase}/api/auth/inscricoes-status`, {
      timeout: 15000,
    });
    return Boolean(data?.publicOpen);
  } catch {
    return false;
  }
}

export function isStoredAdmin() {
  return getStoredRole() === 'admin';
}

export const PUBLIC_REGISTRATION_CLOSED_UI_MESSAGE =
  'As inscrições para a CONMEL estão encerradas. Agradecemos o seu interesse.';

export const PUBLIC_INSCRICAO_URL = 'https://conmelrj.com.br/inscrever';
