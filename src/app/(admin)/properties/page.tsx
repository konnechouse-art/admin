"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { dateLabel, money, PROPERTY_STATUS } from "@/lib/format";
import type { PropertyRow } from "@/lib/types";

const ACTIONS: { status: PropertyRow["status"]; label: string }[] = [
  { status: "PUBLISHED", label: "Publier" },
  { status: "PENDING_REVIEW", label: "Remettre en revue" },
  { status: "SUSPENDED", label: "Masquer" },
  { status: "ARCHIVED", label: "Archiver" },
];

export default function PropertiesPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    api<PropertyRow[]>("/admin/properties", { token })
      .then(setRows)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement"),
      );
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: PropertyRow["status"]) {
    if (!token) return;
    setBusyId(id);
    setError("");
    try {
      await api(`/admin/properties/${id}/status`, {
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
          Gestion des biens
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Valider, publier, masquer ou archiver les annonces (CDC 4.4.1).
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--kh-border)] bg-[var(--kh-bg)] text-[var(--kh-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Bien</th>
              <th className="px-4 py-3 font-semibold">Propriétaire</th>
              <th className="px-4 py-3 font-semibold">Prix</th>
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
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {row.photos?.[0] ? (
                      <img
                        src={row.photos[0]}
                        alt=""
                        className="h-14 w-20 rounded-lg object-cover bg-[var(--kh-bg)]"
                      />
                    ) : (
                      <div className="h-14 w-20 rounded-lg bg-[var(--kh-bg)]" />
                    )}
                    <div>
                      <p className="font-bold text-[var(--kh-primary)]">
                        {row.name}
                      </p>
                      <p className="text-xs text-[var(--kh-text-muted)]">
                        {row.commune}
                        {row.address ? ` · ${row.address}` : ""} ·{" "}
                        {dateLabel(row.createdAt)}
                      </p>
                      <p className="text-xs text-[var(--kh-text-muted)]">
                        {row.photos?.length ?? 0} photo(s)
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium">{row.owner?.fullName || "—"}</p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    {row.owner?.email}
                  </p>
                </td>
                <td className="px-4 py-4 font-semibold">
                  {money(row.pricePerNight)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge
                    status={row.status}
                    label={PROPERTY_STATUS[row.status] || row.status}
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
                  colSpan={5}
                  className="px-4 py-10 text-center text-[var(--kh-text-muted)]"
                >
                  Aucun bien pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
