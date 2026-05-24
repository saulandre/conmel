/**
 * URL base da API e helpers seguros para o fluxo de autenticação.
 */
export const AUTH_PATHS = {
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
};

const PRODUCTION_API_FALLBACK =
  "https://colmel-back-production.up.railway.app";

export function getApiBaseUrl() {
  try {
    const fromEnv = process.env.REACT_APP_API_URL?.trim();
    if (fromEnv) {
      return fromEnv.replace(/\/$/, "");
    }

    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:4000";
      }
    }

    return PRODUCTION_API_FALLBACK;
  } catch {
    return PRODUCTION_API_FALLBACK;
  }
}

/** Lê token da URL sem useSearchParams (evita tela branca no React Router 7). */
export function getPasswordResetTokenFromUrl() {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get("token")?.trim() || "";
  } catch {
    return "";
  }
}

export function getApiErrorMessage(error, fallback = "Ocorreu um erro. Tente novamente.") {
  if (!error) return fallback;

  if (!error.response) {
    return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
  }

  const { status, data } = error.response;
  const msg =
    (typeof data === "string" ? data : null) ||
    data?.message ||
    data?.error ||
    data?.erro ||
    "";

  if (status >= 500) {
    return "Serviço temporariamente indisponível. Tente em alguns minutos.";
  }

  return msg || fallback;
}

/** Backend legado devolvia 404 quando o e-mail não existia — tratar como sucesso genérico. */
export function isLegacyForgotPasswordNotFound(error) {
  const status = error?.response?.status;
  const msg = getApiErrorMessage(error, "");
  return status === 404 && /n[aã]o encontrado|not found/i.test(msg);
}

export const FORGOT_PASSWORD_GENERIC_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha em instantes.";
