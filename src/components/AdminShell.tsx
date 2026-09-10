"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

const COLLAPSE_KEY = "kh_admin_sidebar_collapsed";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY);
    if (saved === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!token || user?.role !== "ADMIN") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, token, user, router, pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  if (loading || !token || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--kh-text-muted)]">
        Chargement…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--kh-bg)]">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
