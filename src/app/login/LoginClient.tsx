"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginClient() {
  const { login, token, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && token && user?.role === "ADMIN") {
      router.replace(params.get("next") || "/overview");
    }
  }, [loading, token, user, router, params]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace(params.get("next") || "/overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Fond réseau — branding Konnect House */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #3478AB 0%, #011A66 48%, #020b2a 100%)",
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern
            id="kh-net"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="8" cy="18" r="1.6" fill="#66CAE4" />
            <circle cx="58" cy="42" r="1.4" fill="#fff" />
            <circle cx="98" cy="12" r="1.5" fill="#66CAE4" />
            <circle cx="34" cy="88" r="1.3" fill="#fff" />
            <circle cx="110" cy="76" r="1.5" fill="#fff" />
            <circle cx="72" cy="108" r="1.2" fill="#66CAE4" />
            <path
              d="M8 18 L58 42 L98 12 M58 42 L34 88 M58 42 L110 76 M34 88 L72 108 L110 76"
              stroke="#66CAE4"
              strokeWidth="0.7"
              fill="none"
              opacity="0.7"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kh-net)" />
      </svg>

      <div className="relative w-full max-w-[420px] rounded-[1.75rem] bg-[#12151c] px-7 py-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-9 sm:py-10">
        {/* Logo dans capsule blanche — comme image 2 */}
        <div className="mx-auto flex h-12 w-[min(100%,220px)] items-center justify-center rounded-full bg-white px-5 shadow-sm">
          <Image
            src="/logo.png"
            alt="Konnect House"
            width={160}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="mt-8 text-center text-4xl font-extrabold tracking-tight">
          Connexion
        </h1>
        <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          Admin backoffice
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Email
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="admin@konnecthouse.cd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1c212b] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#66CAE4]/50 focus:ring-2 focus:ring-[#66CAE4]/20"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Mot de passe
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1c212b] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#66CAE4]/50 focus:ring-2 focus:ring-[#66CAE4]/20"
              />
            </div>
          </label>

          {error ? (
            <p className="text-sm font-medium text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#66CAE4] px-4 py-3.5 text-base font-extrabold text-[#011A66] transition hover:bg-[#8ad7eb] disabled:opacity-60"
          >
            {busy ? "Connexion…" : "Login →"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
          © {new Date().getFullYear()} Konnect House Team
        </p>
      </div>
    </div>
  );
}
