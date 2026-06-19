import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-lg rounded-xl border border-brand-surface bg-brand-card p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">404</p>
        <h1 className="mt-3 text-3xl font-black">Page not found</h1>
        <p className="mt-3 text-brand-textSecondary">The chapter, comic, or resource you requested could not be found.</p>
        <Button asChild className="mt-6">
          <Link href="/browse">Browse comics</Link>
        </Button>
      </div>
    </div>
  );
}
