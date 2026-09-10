"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type IconProps = { className?: string };

function IconOverview({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProperties({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 10.5 12 3l9 7.5V21H3V10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 21v-7h6v7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconProviders({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 19c.8-3 2.9-4.5 5.5-4.5S13.7 16 14.5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 14.5c2 .2 3.5 1.4 4.2 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19.5c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBookings({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconPayments({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="6"
        width="19"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { href: "/overview", label: "Tableau de bord", Icon: IconOverview },
  { href: "/properties", label: "Biens", Icon: IconProperties },
  { href: "/providers", label: "Fournisseurs", Icon: IconProviders },
  { href: "/clients", label: "Utilisateurs", Icon: IconUsers },
  { href: "/bookings", label: "Réservations", Icon: IconBookings },
  { href: "/payments", label: "Paiements", Icon: IconPayments },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`flex shrink-0 flex-col bg-[#011A66] text-white transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div
        className={`border-b border-white/10 ${collapsed ? "px-2 py-4" : "px-4 py-5"}`}
      >
        <div className={`flex items-start ${collapsed ? "justify-center" : "justify-between gap-2"}`}>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66CAE4]">
                Back-office
              </p>
              <h1 className="mt-1 truncate text-lg font-extrabold tracking-tight">
                Konnect House
              </h1>
              <p className="mt-1 truncate text-xs text-white/70">
                {user?.fullName || "Administrateur"}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Étendre le menu" : "Réduire le menu"}
            aria-label={collapsed ? "Étendre le menu" : "Réduire le menu"}
            className="rounded-lg border border-white/20 p-2 text-white/90 hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              {collapsed ? (
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav className={`flex-1 space-y-1 py-4 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href;
          const itemColor = active ? "#011A66" : "rgba(255,255,255,0.9)";
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3 rounded-xl text-sm font-semibold transition ${
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
              } ${active ? "bg-white" : "hover:bg-white/10"}`}
              style={{ color: itemColor }}
            >
              <span className="inline-flex shrink-0" style={{ color: itemColor }}>
                <Icon className="h-5 w-5" />
              </span>
              {!collapsed ? (
                <span className="truncate" style={{ color: itemColor }}>
                  {label}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 ${collapsed ? "p-2" : "p-4"}`}>
        <button
          type="button"
          title="Déconnexion"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className={`w-full rounded-xl border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/10 ${
            collapsed ? "px-2 py-3" : "px-3 py-2.5"
          }`}
        >
          {collapsed ? (
            <svg
              className="mx-auto h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2M14 12H4m0 0 3-3m-3 3 3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            "Déconnexion"
          )}
        </button>
      </div>
    </aside>
  );
}
