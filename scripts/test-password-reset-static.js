/**
 * Verificações estáticas do frontend — fluxo recuperação de senha.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const results = [];

function record(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}${detail ? ` — ${detail}` : ''}`);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const api = read('src/config/api.js');
record('F0 api.js: getApiBaseUrl', api.includes('function getApiBaseUrl'));
record('F0b api.js: AUTH_PATHS.forgotPassword', api.includes("forgot-password"));

const app = read('src/App.jsx');
record('F1 Rotas /recuperarsenha', app.includes("path=\"/recuperarsenha\""));
record('F2 Rotas /novasenha', app.includes("path=\"/novasenha\""));
record(
  'F3 Rota legada /recuperarsenha/route',
  app.includes("path=\"/recuperarsenha/route\"")
);

const forgot = read('src/components/Unauthenticated/ForgotPassword.js');
record('F4 Forgot: loading state', /\[loading,\s*setLoading\]/.test(forgot));
record('F5 Forgot: disabled no submit', /disabled=\{loading \|\| disabled\}/.test(forgot));
record('F6 Forgot: tela sucesso (submitted)', /\[submitted,\s*setSubmitted\]/.test(forgot));
record(
  'F7 Forgot: sem navigate automático pós-sucesso',
  !/setTimeout\(\(\)\s*=>\s*navigate/.test(forgot)
);
record('F8 Forgot: getApiBaseUrl + AUTH_PATHS', forgot.includes('getApiBaseUrl') && forgot.includes('AUTH_PATHS'));
record('F9 Forgot: ErrorBox inline', forgot.includes('ErrorBox'));

const nova = read('src/components/Unauthenticated/NovaSenha.js');
record('F10 NovaSenha: token via URL (sem Suspense)', nova.includes('getPasswordResetTokenFromUrl'));
record(
  'F11 NovaSenha: sem navigate forçado sem token',
  !/useEffect[\s\S]*navigate\(['"]\/['"]\)/.test(nova)
);
record('F12 NovaSenha: UI link inválido', nova.includes('Link inválido'));
record('F13 NovaSenha: getApiBaseUrl + reset path', nova.includes('getApiBaseUrl') && nova.includes('resetPassword'));
record('F14 NovaSenha: validação senha forte', nova.includes('PASSWORD_REGEX'));
record('F15 NovaSenha: estado done sucesso', /\[done,\s*setDone\]/.test(nova));
record('F16 NovaSenha: disabled loading', /disabled=\{loading\}/.test(nova));

const header = read('src/components/Authenticated/Header.jsx');
record('F17 Header oculta nav em /novasenha', header.includes("pathname === '/novasenha'"));

const failed = results.filter((r) => !r.passed);
console.log(`\n=== Frontend estático: ${results.length - failed.length}/${results.length} ===`);
if (failed.length) process.exit(1);
