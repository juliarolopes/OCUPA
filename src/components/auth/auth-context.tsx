import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AUTH_STORAGE_KEY = "ocupa:auth:user";

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
  isReady: boolean;
  login: (data: MockLoginData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): AuthUser | null {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (!parsed || typeof parsed !== "object") return null;
    const user = parsed as Partial<AuthUser>;
    if (
      typeof user.id !== "string" ||
      typeof user.name !== "string" ||
      typeof user.email !== "string"
    ) {
      return null;
    }
    return { id: user.id, name: user.name, email: user.email };
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser) {
  try {
    // MVP local: persistimos apenas a identidade, nunca senha ou token.
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // A sessão em memória continua funcionando se localStorage estiver indisponível.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsReady(true);
  }, []);

  const login = useCallback(({ email, name }: MockLoginData) => {
    const fallbackName = email.split("@")[0] || "Usuário";
    const nextUser = { id: "mock-user", name: name?.trim() || fallbackName, email };
    setUser(nextUser);
    persistUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // O estado React já foi limpo mesmo quando localStorage não está disponível.
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: isReady && user !== null, isReady, login, logout }),
    [isReady, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}
