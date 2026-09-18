import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AccountLayout } from "@/components/ocupa/AccountLayout";
import { SpaceCard } from "@/components/ocupa/SpaceCard";
import { Button } from "@/components/ui/button";
import { getUserHostedSpaces } from "@/data/account";

export const Route = createFileRoute("/meus-espacos")({ component: HostedSpacesPage });

function HostedSpacesPage() {
  const hostedSpaces = getUserHostedSpaces();
  const [message, setMessage] = useState("");

  return (
    <AccountLayout title="Meus espaços" description="Espaços que você disponibiliza no OCUPA.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {hostedSpaces.length}{" "}
          {hostedSpaces.length === 1 ? "espaço publicado" : "espaços publicados"}
        </p>
        <Button
          variant="editorial"
          onClick={() => setMessage("O cadastro de novos espaços será disponibilizado em breve.")}
        >
          <Plus /> Disponibilizar espaço
        </Button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-right text-xs text-primary">
        {message}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hostedSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </AccountLayout>
  );
}
