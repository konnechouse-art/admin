import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--kh-text-muted)]">
          Chargement…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
