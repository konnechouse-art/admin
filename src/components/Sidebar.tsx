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
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconPayments({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="6" width="19" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export const ADMIN_NAV = [
  { href: "/overview", label: "Tableau de bord", Icon: IconOverview },
  { href: "/properties", label: "Biens", Icon: IconProperties },
  { href: "/providers", label: "Fournisseurs", Icon: IconProviders },
  { href: "/clients", label: "Utilisateurs", Icon: IconUsers },
  { href: "/bookings", label: "Réservations", Icon: IconBookings },
  { href: "/payments", label: "Paiements", Icon: IconPayments },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const rail = collapsed;

  return (
    <>
      {/* Overlay mobile */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/50 transition lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(100%,18rem)] flex-col bg-[#011A66] text-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:h-auto lg:min-h-screen lg:shrink-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${rail ? "lg:w-[76px]" : "lg:w-64"}`}
      >
        <div className={`border-b border-white/10 ${rail ? "lg:px-2 lg:py-4" : ""} px-4 py-4`}>
          <div className={`flex items-start gap-2 ${rail ? "lg:justify-center" : "justify-between"}`}>
            <div className={`min-w-0 ${rail ? "lg:hidden" : ""}`}>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleCollapse}
                title={rail ? "Étendre le menu" : "Réduire le menu"}
                aria-label={rail ? "Étendre le menu" : "Réduire le menu"}
                className="hidden rounded-lg border border-white/20 p-2 text-white/90 hover:bg-white/10 lg:inline-flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {rail ? (
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Fermer"
                className="rounded-lg border border-white/20 p-2 text-white/90 hover:bg-white/10 lg:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <nav className={`flex-1 space-y-1 overflow-y-auto py-4 ${rail ? "lg:px-2" : "lg:px-3"} px-3`}>
          {ADMIN_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                data-active={active ? "true" : "false"}
                onClick={onCloseMobile}
                className={`kh-nav-link flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition lg:py-2.5 ${
                  rail ? "lg:justify-center lg:px-2" : ""
                } ${active ? "kh-nav-link-active bg-white" : "hover:bg-white/10"}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`truncate ${rail ? "lg:hidden" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`border-t border-white/10 ${rail ? "lg:p-2" : "lg:p-4"} p-4`}>
          <button
            type="button"
            title="Déconnexion"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-3 text-sm font-semibold text-white hover:bg-white/10 lg:py-2.5 ${
              rail ? "lg:px-2" : ""
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2M14 12H4m0 0 3-3m-3 3 3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={rail ? "lg:hidden" : ""}>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
