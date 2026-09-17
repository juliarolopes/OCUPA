import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FieldErrors = {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
};

type RegistrationFormProps = {
  onSuccess: () => void | Promise<void>;
  onSwitchToLogin: () => void;
  idPrefix?: string;
};

export function RegistrationForm({ onSuccess, onSwitchToLogin, idPrefix = "signup" }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const id = (field: string) => `${idPrefix}-${field}`;

  const completeMockSignup = async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    await onSuccess();
    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome.";
    if (!email.trim()) nextErrors.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Digite um e-mail válido.";
    if (!password) nextErrors.password = "Crie uma senha.";
    else if (password.length < 6) nextErrors.password = "Use ao menos 6 caracteres.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirme sua senha.";
    else if (confirmPassword !== password) nextErrors.confirmPassword = "As senhas não coincidem.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await completeMockSignup();
  };

  const clear = (field: keyof FieldErrors) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <div>
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <FormField htmlFor={id("name")} label="Nome" error={errors.name}>
          <Input
            id={id("name")}
            name="name"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => { setName(event.target.value); clear("name"); }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            disabled={loading}
            className="h-12 rounded-md border-border bg-card shadow-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>

        <FormField htmlFor={id("email")} label="E-mail" error={errors.email}>
          <Input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => { setEmail(event.target.value); clear("email"); }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            disabled={loading}
            className="h-12 rounded-md border-border bg-card shadow-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>

        <FormField htmlFor={id("password")} label="Senha" error={errors.password}>
          <PasswordInput
            id={id("password")}
            name="new-password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(event) => { setPassword(event.target.value); clear("password"); }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? `${id("password")}-error` : undefined}
            disabled={loading}
          />
        </FormField>

        <FormField htmlFor={id("confirm")} label="Confirmar senha" error={errors.confirmPassword}>
          <PasswordInput
            id={id("confirm")}
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(event) => { setConfirmPassword(event.target.value); clear("confirmPassword"); }}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? `${id("confirm")}-error` : undefined}
            disabled={loading}
          />
        </FormField>

        <Button type="submit" variant="editorial" size="editorial" className="w-full rounded-md transition-[background-color,transform] active:scale-[0.99]" disabled={loading}>
          {loading ? <><LoaderCircle className="animate-spin" /> Criando conta...</> : "Criar conta"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButton disabled={loading} onClick={completeMockSignup}>Continuar com Google</SocialLoginButton>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já possui uma conta?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-primary underline-offset-4 hover:underline">Entrar</button>
      </p>
    </div>
  );
}
