"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!token || user?.role !== "ADMIN") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, token, user, router, pathname]);

  if (loading || !token || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--kh-text-muted)]">
        Chargement…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--kh-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
