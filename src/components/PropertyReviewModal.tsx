"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ACCESS_PREF_LABELS,
  AMENITY_LABELS,
  dateLabel,
  money,
  PROPERTY_STATUS,
  whatsappHref,
} from "@/lib/format";
import type { PropertyRow } from "@/lib/types";

const STEPS = [
  { id: "infos", label: "Infos" },
  { id: "photos", label: "Photos" },
  { id: "details", label: "Détails" },
  { id: "owner", label: "Propriétaire" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type Props = {
  property: PropertyRow;
  busy: boolean;
  onClose: () => void;
  onStatus: (status: PropertyRow["status"]) => void;
};

const ACTIONS: { status: PropertyRow["status"]; label: string }[] = [
  { status: "PUBLISHED", label: "Publier" },
  { status: "PENDING_REVIEW", label: "Remettre en revue" },
  { status: "SUSPENDED", label: "Masquer" },
  { status: "ARCHIVED", label: "Archiver" },
];

export default function PropertyReviewModal({
  property,
  busy,
  onClose,
  onStatus,
}: Props) {
  const [step, setStep] = useState<StepId>("infos");
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = (property.photos || []).filter(Boolean);
  const wa = whatsappHref(
    property.owner?.whatsappNumber || property.owner?.phone,
    `Bonjour ${property.owner?.fullName || ""}, concernant votre bien « ${property.name} » sur Konnect House.`,
  );

  useEffect(() => {
    setStep("infos");
    setPhotoIndex(0);
  }, [property.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (step !== "photos" || photos.length < 2) return;
      if (e.key === "ArrowLeft") {
        setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
      }
      if (e.key === "ArrowRight") {
        setPhotoIndex((i) => (i + 1) % photos.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step, photos.length]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-labelledby="property-review-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--kh-border)] px-5 py-4">
          <div className="min-w-0">
            <p
              id="property-review-title"
              className="truncate text-lg font-extrabold text-[var(--kh-primary)]"
            >
              {property.name}
            </p>
            <p className="text-xs text-[var(--kh-text-muted)]">
              {property.commune}
              {property.neighborhood ? ` · ${property.neighborhood}` : ""} ·{" "}
              {dateLabel(property.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-[var(--kh-border)] px-2.5 py-1 text-sm font-semibold"
          >
            Fermer
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-[var(--kh-border)] px-4 py-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                step === s.id
                  ? "bg-[var(--kh-primary)] text-white"
                  : "bg-[var(--kh-bg)] text-[var(--kh-text-muted)] hover:text-[var(--kh-primary)]"
              }`}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {step === "infos" ? (
            <div className="space-y-4">
              {photos[0] ? (
                <button
                  type="button"
                  className="group relative block w-full overflow-hidden rounded-xl bg-[var(--kh-bg)]"
                  onClick={() => {
                    setPhotoIndex(0);
                    setStep("photos");
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[0]}
                    alt=""
                    className="h-52 w-full object-cover transition group-hover:opacity-95"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
                    Voir le carrousel ({photos.length})
                  </span>
                </button>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl bg-[var(--kh-bg)] text-sm text-[var(--kh-text-muted)]">
                  Aucune photo
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={property.status}
                  label={PROPERTY_STATUS[property.status] || property.status}
                />
                <span className="text-sm font-bold text-[var(--kh-primary)]">
                  {money(property.pricePerNight)} / nuit
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-[var(--kh-text-muted)]">Chambres</dt>
                  <dd className="font-semibold">{property.rooms ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--kh-text-muted)]">Capacité</dt>
                  <dd className="font-semibold">
                    {property.capacity != null
                      ? `${property.capacity} pers.`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--kh-text-muted)]">Catégorie</dt>
                  <dd className="font-semibold">
                    {property.category === "MAISON_DE_PASSAGE"
                      ? "Maison de passage"
                      : property.category || "—"}
                  </dd>
                </div>
              </dl>
              <div>
                <p className="text-xs text-[var(--kh-text-muted)]">Adresse</p>
                <p className="text-sm font-medium">
                  {property.address || "Non renseignée"}
                </p>
                {property.gpsLat != null && property.gpsLng != null ? (
                  <a
                    href={`https://maps.google.com/?q=${property.gpsLat},${property.gpsLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs font-bold text-[var(--kh-blue-2)]"
                  >
                    Ouvrir sur Maps
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "photos" ? (
            <div className="space-y-4">
              {photos.length ? (
                <>
                  <div className="relative overflow-hidden rounded-xl bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[photoIndex]}
                      alt={`Photo ${photoIndex + 1}`}
                      className="mx-auto max-h-[52vh] w-full object-contain"
                    />
                    {photos.length > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label="Photo précédente"
                          onClick={() =>
                            setPhotoIndex(
                              (i) => (i - 1 + photos.length) % photos.length,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-bold shadow"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Photo suivante"
                          onClick={() =>
                            setPhotoIndex((i) => (i + 1) % photos.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-bold shadow"
                        >
                          ›
                        </button>
                      </>
                    ) : null}
                    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                      {photoIndex + 1} / {photos.length}
                    </p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((url, i) => (
                      <button
                        key={`${url}-${i}`}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                          i === photoIndex
                            ? "border-[var(--kh-blue-2)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-[var(--kh-text-muted)]">
                  Aucune image pour ce bien.
                </p>
              )}
            </div>
          ) : null}

          {step === "details" ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--kh-text-muted)]">
                  Description
                </p>
                <p className="whitespace-pre-wrap leading-relaxed text-[var(--kh-text)]">
                  {property.description || "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kh-text-muted)]">
                  Équipements
                </p>
                <div className="flex flex-wrap gap-2">
                  {(property.amenities || []).length ? (
                    property.amenities!.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-[var(--kh-bg)] px-2.5 py-1 text-xs font-semibold"
                      >
                        {AMENITY_LABELS[a] || a}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--kh-text-muted)]">Aucun</span>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kh-text-muted)]">
                  Accessibilité
                </p>
                <div className="flex flex-wrap gap-2">
                  {(property.accessTags || []).length ? (
                    property.accessTags!.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-[var(--kh-bg)] px-2.5 py-1 text-xs font-semibold"
                      >
                        {ACCESS_PREF_LABELS[a] || a}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--kh-text-muted)]">
                      Non renseignée
                    </span>
                  )}
                </div>
              </div>
              {property.conditions ? (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--kh-text-muted)]">
                    Conditions
                  </p>
                  <p className="whitespace-pre-wrap">{property.conditions}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "owner" ? (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-bold text-[var(--kh-primary)]">
                  {property.owner?.fullName || "Propriétaire inconnu"}
                </p>
                <p className="text-sm text-[var(--kh-text-muted)]">
                  {property.owner?.email || "Pas d’email"}
                </p>
                <p className="mt-1 text-sm">
                  WhatsApp / tél. :{" "}
                  <span className="font-semibold">
                    {property.owner?.whatsappNumber ||
                      property.owner?.phone ||
                      "Non renseigné"}
                  </span>
                </p>
              </div>

              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-95"
                >
                  <WhatsAppIcon />
                  Contacter sur WhatsApp
                </a>
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Aucun numéro WhatsApp sur le compte fournisseur — impossible
                  d’ouvrir la conversation.
                </p>
              )}

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kh-text-muted)]">
                  Actions de publication
                </p>
                <div className="flex flex-wrap gap-2">
                  {ACTIONS.filter((a) => a.status !== property.status).map(
                    (action) => (
                      <button
                        key={action.status}
                        type="button"
                        disabled={busy}
                        onClick={() => onStatus(action.status)}
                        className="rounded-lg border border-[var(--kh-border)] px-3 py-2 text-xs font-semibold hover:bg-[var(--kh-bg)] disabled:opacity-50"
                      >
                        {action.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--kh-border)] px-5 py-3">
          <button
            type="button"
            disabled={stepIndex <= 0}
            onClick={() => setStep(STEPS[stepIndex - 1].id)}
            className="rounded-lg border border-[var(--kh-border)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Précédent
          </button>
          <p className="text-xs text-[var(--kh-text-muted)]">
            Étape {stepIndex + 1} / {STEPS.length}
          </p>
          {stepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(STEPS[stepIndex + 1].id)}
              className="rounded-lg bg-[var(--kh-primary)] px-3 py-2 text-sm font-semibold text-white"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[var(--kh-primary)] px-3 py-2 text-sm font-semibold text-white"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
