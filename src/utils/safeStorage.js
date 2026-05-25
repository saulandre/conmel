/** Lê JSON do localStorage sem derrubar o React. */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredRole() {
  try {
    return localStorage.getItem("role") || "";
  } catch {
    return "";
  }
}
