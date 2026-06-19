import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] items-center justify-center py-12">
      <Card className="max-w-lg p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-brand-textSecondary">The comic or page you requested could not be found.</p>
        <Button asChild className="mt-6">
          <Link href="/browse">Browse comics</Link>
        </Button>
      </Card>
    </div>
  );
}
