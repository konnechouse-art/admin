"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/format";
import type { DashboardStats } from "@/lib/types";

export default function OverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api<DashboardStats>("/admin/dashboard", { token })
      .then(setStats)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement"),
      );
  }, [token]);

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--kh-primary)]">
          Tableau de bord
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Vue centralisée de l’offre, des réservations et des revenus (CDC 4.4.6).
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Biens publiés"
          value={stats?.propertiesPublished ?? "—"}
        />
        <StatCard
          label="En vérification"
          value={stats?.propertiesPending ?? "—"}
          hint="Annonces à valider"
        />
        <StatCard label="Utilisateurs" value={stats?.users ?? "—"} />
        <StatCard label="Réservations" value={stats?.bookings ?? "—"} />
        <StatCard
          label="Paiements réussis"
          value={stats?.paymentsSucceeded ?? "—"}
        />
        <StatCard label="Revenus" value={stats ? money(stats.revenue) : "—"} />
        <StatCard
          label="Commissions KH"
          value={stats ? money(stats.commission) : "—"}
        />
      </div>
    </div>
  );
}
