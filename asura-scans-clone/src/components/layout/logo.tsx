import Link from "next/link";
import { Flame } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label={`${SITE.name} home`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-purple to-brand-purple-light shadow-purple-soft">
        <Flame className="h-5 w-5 text-white" />
      </span>
      {showWordmark && (
        <span className="text-lg font-extrabold tracking-tight text-white">{SITE.name}</span>
      )}
    </Link>
  );
}
