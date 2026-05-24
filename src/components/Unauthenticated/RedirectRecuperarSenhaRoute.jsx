import { Navigate, useLocation } from "react-router-dom";

/**
 * Links antigos de e-mail: /recuperarsenha/route?token=...
 * Redireciona para /novasenha preservando a query string.
 */
const RedirectRecuperarSenhaRoute = () => {
  const { search } = useLocation();
  return <Navigate to={`/novasenha${search || ""}`} replace />;
};

export default RedirectRecuperarSenhaRoute;
