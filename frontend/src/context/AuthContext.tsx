import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser { token: string; email: string; fullName: string; }

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    return token && email && fullName ? { token, email, fullName } : null;
  });

  const login = (u: AuthUser) => {
    localStorage.setItem('token', u.token);
    localStorage.setItem('email', u.email);
    localStorage.setItem('fullName', u.fullName);
    setUser(u);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);