import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-brand-purple">404</h1>
      <p className="mb-6 text-lg text-brand-text-secondary">Page not found</p>
      <Button asChild className="bg-brand-purple hover:bg-brand-purple-light">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
