import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem('medicita_usuario');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((datosUsuario, token) => {
    localStorage.setItem('medicita_token',   token);
    localStorage.setItem('medicita_usuario', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('medicita_token');
    localStorage.removeItem('medicita_usuario');
    setUsuario(null);
  }, []);

  const estaAutenticado = Boolean(usuario);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaAutenticado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
