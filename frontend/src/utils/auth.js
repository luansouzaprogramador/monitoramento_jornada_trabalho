export const salvarToken = (token) => localStorage.setItem('token', token);
export const obterToken = () => localStorage.getItem('token');
export const removerToken = () => localStorage.removeItem('token');
