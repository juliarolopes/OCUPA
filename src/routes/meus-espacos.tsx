import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { AccountLayout } from "@/components/ocupa/AccountLayout";
import { SpaceCard } from "@/components/ocupa/SpaceCard";
import { Button } from "@/components/ui/button";
import { useSpaces } from "@/context/SpacesContext";
import { getUserHostedSpaces } from "@/data/account";

export const Route = createFileRoute("/meus-espacos")({ component: HostedSpacesPage });

function HostedSpacesPage() {
  const { user } = useAuth();
  const { spaces } = useSpaces();
  const hostedSpaces = user ? getUserHostedSpaces(user.id, spaces) : [];

  return (
    <AccountLayout title="Meus espaços" description="Espaços que você disponibiliza no OCUPA.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {hostedSpaces.length}{" "}
          {hostedSpaces.length === 1 ? "espaço publicado" : "espaços publicados"}
        </p>
        <Button variant="editorial" asChild>
          <Link to="/espacos/novo">
            <Plus /> Disponibilizar espaço
          </Link>
        </Button>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hostedSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </AccountLayout>
  );
}
