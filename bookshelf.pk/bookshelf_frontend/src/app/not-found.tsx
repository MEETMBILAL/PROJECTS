import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href={ROUTES.home} className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
