export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--kh-border)] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[var(--kh-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[var(--kh-primary)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-[var(--kh-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
