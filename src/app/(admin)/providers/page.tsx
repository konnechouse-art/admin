"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ACCOUNT_STATUS, dateLabel } from "@/lib/format";
import type { AdminUser } from "@/lib/types";

const ACTIONS: { status: AdminUser["status"]; label: string }[] = [
  { status: "ACTIVE", label: "Activer" },
  { status: "PENDING", label: "En attente" },
  { status: "SUSPENDED", label: "Suspendre" },
  { status: "BANNED", label: "Bannir" },
];

const KYC_LABEL: Record<string, string> = {
  PENDING: "Non soumis",
  SUBMITTED: "À vérifier",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

export default function ProvidersPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [preview, setPreview] = useState<{
    name: string;
    url: string;
    type?: string | null;
  } | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    api<AdminUser[]>("/admin/users?role=PROVIDER", { token })
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

  async function setKyc(id: string, status: "APPROVED" | "REJECTED") {
    if (!token) return;
    let reason: string | undefined;
    if (status === "REJECTED") {
      reason =
        window.prompt("Motif du refus KYC ?", "Document illisible ou non conforme") ||
        undefined;
      if (!reason) return;
    }
    setBusyId(id);
    setError("");
    try {
      await api(`/admin/users/${id}/kyc`, {
        token,
        method: "PATCH",
        body: { status, reason },
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "KYC impossible");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--kh-primary)]">
          Fournisseurs
        </h2>
        <p className="mt-2 text-[var(--kh-text-muted)]">
          Valider l’identité (KYC), puis activer, suspendre ou bloquer les
          comptes.
        </p>
      </header>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-[var(--kh-border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--kh-border)] bg-[var(--kh-bg)] text-[var(--kh-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Fournisseur</th>
              <th className="px-4 py-3 font-semibold">KYC</th>
              <th className="px-4 py-3 font-semibold">Activité</th>
              <th className="px-4 py-3 font-semibold">Paiement</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const kyc = row.providerProfile?.kycStatus || "PENDING";
              const doc = row.providerProfile?.idDocumentUrl;
              return (
                <tr
                  key={row.id}
                  className="border-b border-[var(--kh-border)] last:border-0"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      {row.providerProfile?.avatarUrl ? (
                        <img
                          src={row.providerProfile.avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full border border-[var(--kh-border)] object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="font-bold text-[var(--kh-primary)]">
                          {row.fullName}
                        </p>
                        <p className="text-xs text-[var(--kh-text-muted)]">
                          {row.email}
                        </p>
                        <p className="text-xs text-[var(--kh-text-muted)]">
                          {row.phone || "Pas de téléphone"} · inscrit{" "}
                          {dateLabel(row.createdAt)}
                        </p>
                        {row.providerProfile?.profession ||
                        row.providerProfile?.homeCommune ? (
                          <p className="mt-1 text-xs text-[var(--kh-text-muted)]">
                            {[
                              row.providerProfile?.profession,
                              row.providerProfile?.homeCommune,
                              row.providerProfile?.homeCity,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[var(--kh-primary)]">
                      {KYC_LABEL[kyc] || kyc}
                    </p>
                    <p className="text-xs text-[var(--kh-text-muted)]">
                      {row.providerProfile?.idDocumentType || "Type —"}
                    </p>
                    {doc ? (
                      <button
                        type="button"
                        className="mt-1 text-xs font-bold text-[var(--kh-blue-2)]"
                        onClick={() =>
                          setPreview({
                            name: row.fullName,
                            url: doc,
                            type: row.providerProfile?.idDocumentType,
                          })
                        }
                      >
                        Voir la pièce
                      </button>
                    ) : (
                      <p className="mt-1 text-xs text-amber-700">
                        Pièce manquante
                      </p>
                    )}
                    {row.providerProfile?.kycRejectionReason ? (
                      <p className="mt-1 text-xs text-red-600">
                        {row.providerProfile.kycRejectionReason}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doc && kyc !== "APPROVED" ? (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => setKyc(row.id, "APPROVED")}
                          className="rounded-lg border border-emerald-300 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
                        >
                          Approuver KYC
                        </button>
                      ) : null}
                      {doc && kyc !== "REJECTED" ? (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => setKyc(row.id, "REJECTED")}
                          className="rounded-lg border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Refuser
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p>{row._count?.properties ?? 0} bien(s) en ligne</p>
                    {row.providerProfile?.propertyCount != null ? (
                      <p className="text-xs text-[var(--kh-text-muted)]">
                        Déclare {row.providerProfile.propertyCount} bien(s)
                        {row.providerProfile.propertyTypes?.length
                          ? ` · ${row.providerProfile.propertyTypes.join(", ")}`
                          : ""}
                      </p>
                    ) : null}
                    <p className="text-xs text-[var(--kh-text-muted)]">
                      {row._count?.bookings ?? 0} réservation(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs text-[var(--kh-text-muted)]">
                    <p>{row.providerProfile?.mobileMoneyNumber || "—"}</p>
                    <p>
                      {(row.providerProfile?.acceptedPaymentMethods || []).join(
                        ", ",
                      ) || "Moyens non renseignés"}
                    </p>
                  </td>
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
              );
            })}
            {!rows.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[var(--kh-text-muted)]"
                >
                  Aucun fournisseur.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPreview(null)}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[var(--kh-primary)]">
                  Pièce — {preview.name}
                </p>
                <p className="text-xs text-[var(--kh-text-muted)]">
                  {preview.type || "Document"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg border px-2 py-1 text-sm"
              >
                Fermer
              </button>
            </div>
            {preview.url.startsWith("data:application/pdf") ||
            preview.url.toLowerCase().includes(".pdf") ? (
              <iframe
                title="Pièce PDF"
                src={preview.url}
                className="h-[70vh] w-full rounded-xl border"
              />
            ) : (
              <img
                src={preview.url}
                alt="Pièce d’identité"
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
