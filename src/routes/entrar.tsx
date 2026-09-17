import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — OCUPA" },
      { name: "description", content: "Entre na sua conta OCUPA para continuar explorando espaços disponíveis." },
      { property: "og:title", content: "Entrar — OCUPA" },
      { property: "og:description", content: "Acesse sua conta e encontre espaços para guardar, criar e trabalhar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}