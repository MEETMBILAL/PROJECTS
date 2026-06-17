import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href={ROUTES.home} className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
