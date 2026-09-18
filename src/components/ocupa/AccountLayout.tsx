import { LockKeyhole } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { useAuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/ocupa/Footer";
import { Navbar } from "@/components/ocupa/Navbar";
import { Button } from "@/components/ui/button";

type AccountLayoutProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
};

export function AccountLayout({
  children,
  eyebrow = "Área pessoal",
  title,
  description,
}: AccountLayoutProps) {
  const { isAuthenticated, isReady } = useAuth();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    if (isReady && !isAuthenticated) openAuth("default");
  }, [isAuthenticated, isReady, openAuth]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Navbar compact />
      {!isReady ? (
        <main className="flex min-h-[34rem] flex-1 items-center justify-center px-5 py-16">
          <p className="text-sm text-muted-foreground">Carregando sua conta…</p>
        </main>
      ) : isAuthenticated ? (
        <main className="mx-auto w-full max-w-[1080px] flex-1 px-5 pb-20 pt-10 md:px-8 md:pb-24">
          <header className="border-b border-border pb-8 md:pb-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-none text-primary sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </header>
          <div className="pt-10">{children}</div>
        </main>
      ) : (
        <main className="grid min-h-[34rem] flex-1 place-items-center px-5 py-16 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-light-green text-primary">
              <LockKeyhole className="size-6" />
            </span>
            <h1 className="mt-6 font-serif text-3xl text-primary">Entre para acessar sua conta</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Esta área reúne suas informações e atividades no OCUPA.
            </p>
            <Button
              variant="editorial"
              size="editorial"
              className="mt-7"
              onClick={() => openAuth("default")}
            >
              Entrar
            </Button>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
