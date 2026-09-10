const BASE = String(
  process.env.NEXT_PUBLIC_API_URL ??
    "https://konnect-house-backend-production.up.railway.app",
).replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${BASE}/api${path.startsWith("/") ? path : `/${path}`}`;
}

export async function api<T = unknown>(
  path: string,
  {
    token,
    method = "GET",
    body,
  }: {
    token?: string;
    method?: string;
    body?: unknown;
  } = {},
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const raw =
      (data as { message?: string | string[]; error?: string }).message ??
      (data as { error?: string }).error ??
      `Erreur ${res.status}`;
    throw new Error(Array.isArray(raw) ? raw.join(" ") : String(raw));
  }
  return data as T;
}
