"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ACCOUNT_STATUS, dateLabel } from "@/lib/format";
import type { AdminUser } from "@/lib/types";

const ACTIONS: { status: AdminUser["status"]; label: string }[] = [
  { status: "ACTIVE", label: "Activer" },
  { status: "SUSPENDED", label: "Suspendre" },
  { status: "BANNED", label: "Bannir" },
];

export default function ClientsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    api<AdminUser[]>("/admin/users?role=CLIENT", { token })
      .then(setRows)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement"),
      );
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: AdminUser["status"]) {
    if (!token) return;
    setBusyId(id);
    setError("");
    try {
      await api(`/admin/users/${id}/status`, {
        token,
        method: "PATCH",
        body: { status },
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--kh-primary)]">
          Utilisateurs
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Consulter et modérer les comptes clients WhatsApp (CDC 4.4.3).
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--kh-border)] bg-[var(--kh-bg)] text-[var(--kh-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Réservations</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--kh-border)] last:border-0"
              >
                <td className="px-4 py-4">
                  <p className="font-bold text-[var(--kh-primary)]">
                    {row.fullName}
                  </p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    {row.email || "Sans email"} · {row.phone || "Sans téléphone"}
                  </p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    Inscrit {dateLabel(row.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-4">{row._count?.bookings ?? 0}</td>
                <td className="px-4 py-4">
                  <StatusBadge
                    status={row.status}
                    label={ACCOUNT_STATUS[row.status] || row.status}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.filter((a) => a.status !== row.status).map(
                      (action) => (
                        <button
                          key={action.status}
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => setStatus(row.id, action.status)}
                          className="rounded-lg border border-[var(--kh-border)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--kh-bg)] disabled:opacity-50"
                        >
                          {action.label}
                        </button>
                      ),
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-[var(--kh-text-muted)]"
                >
                  Aucun client pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
