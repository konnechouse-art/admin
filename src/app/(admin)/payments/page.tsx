"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { dateLabel, money, PAYMENT_STATUS } from "@/lib/format";
import type { PaymentRow } from "@/lib/types";

export default function PaymentsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api<PaymentRow[]>("/admin/payments", { token })
      .then(setRows)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erreur de chargement"),
      );
  }, [token]);

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--kh-primary)]">
          Paiements
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Transactions, commissions et parts fournisseurs (CDC 4.4.5).
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--kh-border)] bg-[var(--kh-bg)] text-[var(--kh-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Transaction</th>
              <th className="px-4 py-3 font-semibold">Répartition</th>
              <th className="px-4 py-3 font-semibold">Méthode</th>
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
                    {money(row.paidAmount)}
                  </p>
                  <p className="text-xs text-[var(--kh-text-muted)]">
                    Booking {row.booking?.id?.slice(0, 8) || "—"} ·{" "}
                    {dateLabel(row.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-4 text-xs">
                  <p>
                    Commission KH :{" "}
                    <strong>{money(row.booking?.commissionAmount)}</strong>
                  </p>
                  <p>
                    Part fournisseur :{" "}
                    <strong>{money(row.booking?.providerAmount)}</strong>
                  </p>
                  <p>Frais : {money(row.fees)} · Payout {row.payoutStatus || "—"}</p>
                </td>
                <td className="px-4 py-4">{row.method || "—"}</td>
                <td className="px-4 py-4">
                  <StatusBadge
                    status={row.status}
                    label={PAYMENT_STATUS[row.status] || row.status}
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
                  Aucun paiement.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
