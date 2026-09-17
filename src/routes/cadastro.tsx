import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — OCUPA" },
      { name: "description", content: "Crie sua conta OCUPA para encontrar novos usos para espaços disponíveis." },
      { property: "og:title", content: "Criar conta — OCUPA" },
      { property: "og:description", content: "Em breve, você poderá criar sua conta e ocupar novos espaços." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegistrationPage,
});

function RegistrationPage() {
  return (
    <AuthLayout>
      <div>
        <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">Sua conta</p>
        <h1 className="font-serif text-[2.5rem] leading-none text-primary sm:text-[2.8rem]">Criar conta.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
          O cadastro estará disponível em breve. Enquanto isso, continue explorando os espaços da OCUPA.
        </p>
        <Button variant="editorial" size="editorial" className="mt-8 w-full rounded-md" asChild>
          <Link to="/entrar"><ArrowLeft /> Voltar para entrar</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}