import Link from "next/link";
import { cn } from "@/lib/utils";

interface GenreTagProps {
  name: string;
  slug: string;
  className?: string;
}

export function GenreTag({ name, slug, className }: GenreTagProps) {
  return (
    <Link
      href={`/browse?genres=${slug}`}
      className={cn(
        "inline-flex items-center rounded-full border border-brand-purple/50 px-3 py-1 text-xs font-medium text-brand-purple-light transition-colors duration-150 hover:border-brand-purple hover:bg-brand-purple/10",
        className
      )}
    >
      {name}
    </Link>
  );
}
