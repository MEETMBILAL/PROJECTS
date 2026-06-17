import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="font-mono text-sm text-secondary">404</p>
      <h1 className="mt-2 text-4xl text-primary">Page not found</h1>
      <p className="mt-3 max-w-md text-text-secondary">
        The page you are looking for might have been moved, deleted, or never existed.
      </p>
      <Link href={ROUTES.home} className="btn-primary mt-6">
        Back to homepage
      </Link>
    </div>
  );
}
