import Link from "next/link";
import { cn } from "@/lib/utils";

export function GenreBadge({
  name,
  className,
  asLink = true,
}: {
  name: string;
  className?: string;
  asLink?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center rounded-md border border-brand-purple/60 px-2.5 py-1 text-xs font-medium text-brand-purple-light transition-colors duration-150 hover:border-brand-purple hover:bg-brand-purple hover:text-white",
    className
  );

  if (!asLink) {
    return <span className={classes}>{name}</span>;
  }

  return (
    <Link
      href={`/browse?genre=${encodeURIComponent(name)}`}
      className={classes}
    >
      {name}
    </Link>
  );
}
