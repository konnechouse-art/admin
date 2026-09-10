export function money(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

export function dateLabel(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const PROPERTY_STATUS: Record<string, string> = {
  PENDING_REVIEW: "En vérification",
  PUBLISHED: "Publié",
  SUSPENDED: "Masqué",
  ARCHIVED: "Archivé",
};

export const ACCOUNT_STATUS: Record<string, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  BANNED: "Banni",
};

export const BOOKING_STATUS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

export const PAYMENT_STATUS: Record<string, string> = {
  PENDING: "En attente",
  SUCCEEDED: "Réussi",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};
