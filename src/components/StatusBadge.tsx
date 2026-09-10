const TONES: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-100 text-amber-900",
  PENDING: "bg-amber-100 text-amber-900",
  PUBLISHED: "bg-emerald-100 text-emerald-900",
  ACTIVE: "bg-emerald-100 text-emerald-900",
  SUCCEEDED: "bg-emerald-100 text-emerald-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  IN_PROGRESS: "bg-sky-100 text-sky-900",
  COMPLETED: "bg-slate-100 text-slate-800",
  SUSPENDED: "bg-orange-100 text-orange-900",
  ARCHIVED: "bg-slate-100 text-slate-700",
  BANNED: "bg-red-100 text-red-900",
  CANCELLED: "bg-red-100 text-red-900",
  FAILED: "bg-red-100 text-red-900",
  REFUNDED: "bg-violet-100 text-violet-900",
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        TONES[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}
