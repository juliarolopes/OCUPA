import { Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FieldErrors = {
  email?: string | undefined;
  password?: string | undefined;
};

type LoginFormProps = {
  headline?: string;
  support?: string;
  idPrefix?: string;
  showBrand?: boolean;
  showHeading?: boolean;
  onSuccess?: () => void | Promise<void>;
  onSwitchToRegister?: (() => void) | undefined;
};

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = "Informe seu e-mail.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Digite um e-mail válido.";
  if (!password) errors.password = "Informe sua senha.";
  return errors;
}

export function LoginForm({
  headline = "Seja",
  support = "Entre na sua conta para continuar.",
  idPrefix = "login",
  showBrand = true,
  showHeading = true,
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const id = (field: string) => `${idPrefix}-${field}`;

  const completeMockLogin = async (mockEmail = email) => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    login({ email: mockEmail });
    if (onSuccess) {
      await onSuccess();
      setLoading(false);
      return;
    }
    await navigate({ to: "/", hash: "explorar" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await completeMockLogin();
  };

  return (
    <div>
      {showBrand ? (
        <Link to="/" className="hidden w-fit font-serif text-[1.45rem] text-primary transition-opacity hover:opacity-70 lg:block" aria-label="OCUPA, página inicial">
          OCUPA
        </Link>
      ) : null}
      {showHeading ? (
        <div className={showBrand ? "mt-0 lg:mt-14" : "mt-0"}>
          <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">Sua conta</p>
          <h1 className="font-serif text-[2.5rem] leading-none text-primary sm:text-[2.8rem]">{headline}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{support}</p>
        </div>
      ) : null}

      <form className={showHeading ? "mt-8 space-y-5" : "space-y-5"} noValidate onSubmit={handleSubmit}>
        <FormField htmlFor={id("email")} label="E-mail" error={errors.email}>
          <Input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            disabled={loading}
            className="h-12 rounded-md border-border bg-card shadow-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FormField>

        <FormField
          htmlFor={id("password")}
          label="Senha"
          error={errors.password}
          labelAction={<a href="#recuperar" className="text-xs text-primary underline-offset-4 hover:underline">Esqueci minha senha</a>}
        >
          <PasswordInput
            id={id("password")}
            name="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? `${id("password")}-error` : undefined}
            disabled={loading}
          />
        </FormField>

        <Button type="submit" variant="editorial" size="editorial" className="w-full rounded-md transition-[background-color,transform] active:scale-[0.99]" disabled={loading}>
          {loading ? <><LoaderCircle className="animate-spin" /> Entrando...</> : "Entrar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButton disabled={loading} onClick={() => completeMockLogin("usuario@google.mock")}>Continuar com Google</SocialLoginButton>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        {onSwitchToRegister ? (
          <button type="button" onClick={onSwitchToRegister} className="font-medium text-primary underline-offset-4 hover:underline">Criar conta</button>
        ) : (
          <a href="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">Criar conta</a>
        )}
      </p>
    </div>
  );
}
