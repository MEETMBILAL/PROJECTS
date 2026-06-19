import Link from "next/link";
import { cn } from "@/lib/utils";

export function GenreBadge({
  name,
  slug,
  asLink = true,
  className,
}: {
  name: string;
  slug?: string;
  asLink?: boolean;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center rounded-full border border-brand-purple/50 px-3 py-1 text-xs font-medium text-brand-purple-light transition-colors duration-150 hover:bg-brand-purple/15 hover:border-brand-purple",
    className,
  );

  if (asLink && slug) {
    return (
      <Link href={`/browse?genres=${slug}`} className={classes}>
        {name}
      </Link>
    );
  }
  return <span className={classes}>{name}</span>;
}
