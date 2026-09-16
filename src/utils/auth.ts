// Persistence - localStorage (Clase 04)
// Un pequeno helper para no repetir JSON.stringify/parse ni la key en
// varios lugares.

const TOKEN_KEY = 'logged';

export function setLoggedIn(): void {
  localStorage.setItem(TOKEN_KEY, 'true');
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(TOKEN_KEY) === 'true';
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
