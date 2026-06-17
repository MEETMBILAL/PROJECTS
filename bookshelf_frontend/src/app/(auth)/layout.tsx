import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent px-4 py-12">
      <div className="w-full max-w-md">
        <Link href={ROUTES.home} className="mb-8 block text-center">
          <span className="font-display text-3xl font-bold text-primary">
            Bookshelf<span className="text-secondary">.pk</span>
          </span>
        </Link>
        <div className="rounded-2xl border border-bsborder bg-white p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
