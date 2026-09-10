"use client";

import { FormEvent, useEffect, useState } from "react";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(102,202,228,0.35), transparent 40%), radial-gradient(circle at 85% 10%, rgba(52,120,171,0.28), transparent 35%), linear-gradient(160deg, #011A66 0%, #0b2f7a 45%, #173a6d 100%)",
        }}
      />
      <div className="relative w-full max-w-md rounded-[1.75rem] border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kh-blue-2)]">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-[var(--kh-primary)]">
          Konnect House
        </h1>
        <p className="mt-2 text-sm text-[var(--kh-text-muted)]">
          Connexion réservée à l’équipe Konnect House.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--kh-border)] bg-[var(--kh-bg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--kh-blue-2)]/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              Mot de passe
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--kh-border)] bg-[var(--kh-bg)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--kh-blue-2)]/40"
            />
          </label>
          {error ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[var(--kh-primary)] px-4 py-3 font-bold text-white transition hover:bg-[var(--kh-blue-2)] disabled:opacity-60"
          >
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
