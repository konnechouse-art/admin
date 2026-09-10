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

export const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  climatisation: "Climatisation",
  eau_chaude: "Eau chaude",
  securite: "Sécurité",
  cuisine: "Cuisine",
  salle_de_bain_privee: "Salle de bain privée",
  tv: "TV",
};

export const ACCESS_PREF_LABELS: Record<string, string> = {
  pres_macadam: "Près du macadam / grande voie",
  acces_facile: "Accès facile (voiture)",
  quartier_calme: "Quartier calme",
  proche_commerces: "Proche commerces / marché",
  proche_transports: "Proche transports",
};

/** Normalise un numéro pour wa.me (chiffres seuls, avec indicatif si possible). */
export function whatsappHref(
  phone?: string | null,
  message?: string,
): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0") && digits.length >= 9) {
    digits = `243${digits.slice(1)}`;
  }
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
