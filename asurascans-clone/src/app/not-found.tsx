import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-7xl font-black text-brand-purple">404</p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="max-w-md text-sm text-brand-text-secondary">
        The page or comic you&apos;re looking for doesn&apos;t exist or may have
        been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
