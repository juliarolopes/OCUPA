import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, CalendarCheck, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const accountItems = [
  { to: "/conta" as const, label: "Meu perfil", icon: User },
  { to: "/reservas" as const, label: "Minhas reservas", icon: CalendarCheck },
  { to: "/meus-espacos" as const, label: "Meus espaços", icon: Building2 },
  { to: "/configuracoes" as const, label: "Configurações", icon: Settings },
];

function UserIdentity({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  if (!user) return null;
  const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <>
      <span
        className="grid size-7 shrink-0 place-items-center rounded-full bg-light-green text-xs font-semibold text-primary"
        aria-hidden="true"
      >
        {initial}
      </span>
      <span className={compact ? "min-w-0" : "max-w-28 truncate"}>
        <span className="block truncate font-medium text-foreground">{user.name}</span>
        {compact ? (
          <span className="block truncate text-[0.65rem] font-normal text-muted-foreground">
            {user.email}
          </span>
        ) : null}
      </span>
    </>
  );
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const signOut = () => {
    setOpen(false);
    logout();
    void navigate({ to: "/" });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="nav"
          className="group h-10 gap-2 px-3 text-xs text-primary transition-[color,transform] active:scale-[0.96]"
          aria-label={`Abrir menu de ${user.name}`}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <UserIdentity />
          <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 border-border bg-card p-2 shadow-[0_16px_35px_-24px_var(--foreground)]"
      >
        <DropdownMenuLabel className="px-3 py-2.5 font-normal">
          <span className="block text-sm font-semibold text-foreground">Olá, {user.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountItems.map(({ to, label, icon: Icon }) => (
          <DropdownMenuItem
            key={to}
            asChild
            className="cursor-pointer px-3 py-2.5 focus:bg-light-green/70 focus:text-primary"
          >
            <Link to={to} onClick={() => setOpen(false)}>
              <Icon />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={signOut}
          className="cursor-pointer px-3 py-2.5 text-terracotta focus:bg-terracotta/10 focus:text-terracotta"
        >
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileUserMenu({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const signOut = () => {
    onNavigate();
    logout();
    void navigate({ to: "/" });
  };

  return (
    <div className="border-b border-border pb-2">
      <Link
        to="/conta"
        onClick={onNavigate}
        className="mb-2 flex items-center gap-3 bg-light-green/55 px-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UserIdentity compact />
      </Link>
      {accountItems.slice(1).map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 px-3 py-2 text-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className="size-4 text-primary" strokeWidth={1.7} />
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={signOut}
        className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <LogOut className="size-4" strokeWidth={1.7} /> Sair
      </button>
    </div>
  );
}
