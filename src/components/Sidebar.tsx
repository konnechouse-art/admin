"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/overview", label: "Tableau de bord" },
  { href: "/properties", label: "Biens" },
  { href: "/providers", label: "Fournisseurs" },
  { href: "/clients", label: "Utilisateurs" },
  { href: "/bookings", label: "Réservations" },
  { href: "/payments", label: "Paiements" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--kh-border)] bg-[var(--kh-primary)] text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--kh-sky)]">
          Back-office
        </p>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight">
          Konnect House
        </h1>
        <p className="mt-1 truncate text-sm text-white/70">
          {user?.fullName || "Administrateur"}
        </p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white text-[var(--kh-primary)]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="w-full rounded-xl border border-white/20 px-3 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
