/**
 * URL base da API — use em todas as chamadas axios do frontend.
 */
export function getApiBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:4000';
    }
  }

  return 'https://colmel-back-production.up.railway.app';
}

export const AUTH_PATHS = {
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
};
