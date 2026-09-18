import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, CalendarCheck, Heart, LogOut, Settings, User } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { AccountLayout } from "@/components/ocupa/AccountLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/conta")({ component: AccountPage });

const activities = [
  {
    to: "/reservas" as const,
    title: "Minhas reservas",
    text: "Consulte reservas atuais e anteriores.",
    icon: CalendarCheck,
  },
  {
    to: "/meus-espacos" as const,
    title: "Meus espaços",
    text: "Veja os espaços que você disponibiliza.",
    icon: Building2,
  },
  {
    to: "/favoritos" as const,
    title: "Favoritos",
    text: "Retome os espaços que você salvou.",
    icon: Heart,
  },
  {
    to: "/configuracoes" as const,
    title: "Configurações",
    text: "Ajuste preferências da sua conta.",
    icon: Settings,
  },
];

function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    void navigate({ to: "/" });
  };

  return (
    <AccountLayout title="Minha conta" description="Seu espaço pessoal dentro do OCUPA.">
      {user ? (
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-4">
              <span
                className="grid size-14 place-items-center rounded-full bg-light-green font-serif text-2xl text-primary"
                aria-hidden="true"
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <h2 className="font-serif text-2xl text-primary">Informações pessoais</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dados disponíveis no perfil atual.
                </p>
              </div>
            </div>
            <dl className="mt-7 grid border-y border-border sm:grid-cols-2">
              <div className="py-5 sm:border-r sm:border-border sm:pr-6">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Nome
                </dt>
                <dd className="mt-2 text-sm font-medium">{user.name}</dd>
              </div>
              <div className="border-t border-border py-5 sm:border-t-0 sm:pl-6">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  E-mail
                </dt>
                <dd className="mt-2 text-sm font-medium">{user.email}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-primary">Minhas atividades</h2>
            <div className="mt-5 grid border-t border-border sm:grid-cols-2">
              {activities.map(({ to, title, text, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex gap-4 border-b border-border py-5 sm:odd:pr-6 sm:even:pl-6 sm:even:border-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
                  <span>
                    <strong className="block text-sm group-hover:text-primary">{title}</strong>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {text}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8">
            <div>
              <h2 className="text-sm font-semibold">Segurança</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Encerre a sessão neste dispositivo.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={signOut} className="text-terracotta">
              <LogOut /> Sair da conta
            </Button>
          </section>
        </div>
      ) : null}
    </AccountLayout>
  );
}
