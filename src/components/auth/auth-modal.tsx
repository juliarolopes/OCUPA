import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthIntent = "default" | "host" | "booking";

export type AuthCopy = {
  headline: string;
  support: string;
};

export const authCopy: Record<AuthIntent, AuthCopy> = {
  default: {
    headline: "Bem-vindo de volta.",
    support: "Entre na sua conta para continuar.",
  },
  host: {
    headline: "Tem um espaço parado?",
    support: "Entre para começar a disponibilizar seu espaço.",
  },
  booking: {
    headline: "Quase lá.",
    support: "Entre na sua conta para reservar este espaço.",
  },
};

type OpenOptions = {
  onSuccess?: () => void | Promise<void>;
};

type AuthModalState = {
  open: boolean;
  intent: AuthIntent;
  onSuccess?: (() => void | Promise<void>) | undefined;
};

type AuthModalContextValue = {
  state: AuthModalState;
  openAuth: (intent?: AuthIntent, options?: OpenOptions) => void;
  closeAuth: () => void;
  setOpen: (open: boolean) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthModalState>({ open: false, intent: "default" });

  const openAuth = useCallback((intent: AuthIntent = "default", options?: OpenOptions) => {
    setState({ open: true, intent, onSuccess: options?.onSuccess });
  }, []);

  const closeAuth = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState((current) => ({ ...current, open }));
  }, []);

  const value = useMemo(() => ({ state, openAuth, closeAuth, setOpen }), [state, openAuth, closeAuth, setOpen]);

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal precisa estar dentro de AuthModalProvider");
  return context;
}
