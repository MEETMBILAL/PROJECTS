import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <LogoMark className="h-14 w-14 opacity-80" />
      <h1 className="text-5xl font-extrabold text-white">404</h1>
      <p className="max-w-sm text-brand-text-secondary">
        We couldn&apos;t find the page you were looking for. It may have been moved or deleted.
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
