import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="asura-container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-light">404</p>
      <h1 className="mt-3 text-4xl font-bold text-white">This chapter vanished into the dungeon.</h1>
      <p className="mt-3 max-w-lg text-brand-secondary">The page you requested does not exist or has been moved.</p>
      <Button asChild className="mt-6 bg-brand-primary hover:bg-brand-light">
        <Link href="/browse">Browse comics</Link>
      </Button>
    </div>
  );
}
