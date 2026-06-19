import Link from "next/link";

import { cn } from "@/lib/utils";

/** Clickable pill badge with purple outline theme, used for genre tags. */
export function GenrePill({
  name,
  slug,
  className,
  active = false,
}: {
  name: string;
  slug: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={`/browse?genres=${slug}`}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150",
        active
          ? "border-brand-purple bg-brand-purple/15 text-brand-purple-light"
          : "border-brand-purple/40 text-brand-text-secondary hover:border-brand-purple hover:bg-brand-purple/10 hover:text-brand-purple-light",
        className
      )}
    >
      {name}
    </Link>
  );
}
