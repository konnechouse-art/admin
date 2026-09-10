"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BOOKING_STATUS, dateLabel, money } from "@/lib/format";
import type { BookingRow } from "@/lib/types";

export default function BookingsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api<BookingRow[]>("/admin/bookings", { token })
      .then(setRows)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement"),
      );
  }, [token]);

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--kh-primary)]">
          Réservations
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Historique et suivi des séjours (CDC 4.4.4).
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--kh-border)] bg-[var(--kh-bg)] text-[var(--kh-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Réservation</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Montants</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
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
                    {row.property?.name || row.reference || "Bien"}
                  </p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    {dateLabel(row.checkIn)} → {dateLabel(row.checkOut)}
                  </p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    Créée {dateLabel(row.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium">{row.client?.fullName || "—"}</p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    {row.client?.phone || "—"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{money(row.totalAmount)}</p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    Commission {money(row.commissionAmount)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge
                    status={row.status}
                    label={BOOKING_STATUS[row.status] || row.status}
                  />
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-[var(--kh-text-muted)]"
                >
                  Aucune réservation.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
