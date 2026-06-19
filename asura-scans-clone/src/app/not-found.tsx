import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-extrabold text-brand-purple">404</p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-brand-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/browse">Browse comics</Link>
        </Button>
      </div>
    </div>
  );
}
