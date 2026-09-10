"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "./api";

const KEY = "kh_admin_token";

type AuthUser = {
  id: string;
  fullName: string;
  email: string | null;
  role: string;
  status: string;
};

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(KEY) || "";
    setToken(saved);
    if (!saved) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api<AuthUser>("/auth/me", { token: saved })
      .then((data) => {
        if (cancelled) return;
        if (data.role !== "ADMIN") {
          localStorage.removeItem(KEY);
          setToken("");
          setUser(null);
          return;
        }
        setUser(data);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(KEY);
        setToken("");
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; data: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (res.data.role !== "ADMIN") {
      throw new Error("Accès réservé aux administrateurs Konnect House.");
    }
    localStorage.setItem(KEY, res.token);
    setToken(res.token);
    setUser(res.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
