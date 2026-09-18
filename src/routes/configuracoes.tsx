import { createFileRoute } from "@tanstack/react-router";
import { Bell, LockKeyhole, Mail, Shield, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

import { AccountLayout } from "@/components/ocupa/AccountLayout";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/configuracoes")({ component: SettingsPage });

function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);

  return (
    <AccountLayout
      title="Configurações"
      description="Ajuste preferências da sua experiência no OCUPA."
    >
      <p className="mb-8 bg-light-green/55 px-4 py-3 text-xs leading-5 text-primary">
        Estas preferências funcionam apenas nesta sessão enquanto a integração com a conta não está
        disponível.
      </p>
      <div className="divide-y divide-border border-y border-border">
        <SettingSection
          icon={UserRound}
          title="Dados da conta"
          text="Nome e e-mail são gerenciados pela sua conta OCUPA."
        />
        <SettingSection
          icon={Bell}
          title="Notificações"
          text="Escolha quais lembretes deseja receber."
        >
          <Preference
            label="Notificações por e-mail"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            icon={Mail}
          />
          <Preference
            label="Lembretes de reserva"
            checked={reservationReminders}
            onCheckedChange={setReservationReminders}
            icon={Bell}
          />
        </SettingSection>
        <SettingSection
          icon={Shield}
          title="Privacidade"
          text="Controles de privacidade serão conectados à sua conta futuramente."
        />
        <SettingSection
          icon={LockKeyhole}
          title="Segurança"
          text="Alteração de senha e sessões ativas estarão disponíveis com o backend."
        />
      </div>
    </AccountLayout>
  );
}

function SettingSection({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="grid gap-5 py-7 sm:grid-cols-[12rem_1fr]">
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-5 text-primary" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
        {children ? <div className="mt-5 space-y-4">{children}</div> : null}
      </div>
    </section>
  );
}

function Preference({
  label,
  checked,
  onCheckedChange,
  icon: Icon,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon: typeof Mail;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-t border-border pt-4 text-sm">
      <span className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </label>
  );
}
