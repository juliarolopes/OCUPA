import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type MockLoginData = {
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: MockLoginData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(({ email, name }: MockLoginData) => {
    const fallbackName = email.split("@")[0] || "Usuário";
    setUser({ id: "mock-user", name: name?.trim() || fallbackName, email });
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}
