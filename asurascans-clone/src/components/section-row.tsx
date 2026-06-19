import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  href?: string;
  className?: string;
}

export function SectionHeading({ title, href, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <h2 className="section-heading">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm font-medium text-brand-text-secondary transition-colors hover:text-brand-purple-light"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/** Horizontal, snap-scrolling row used for Trending and Related comics. */
export function ScrollRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2",
        className
      )}
    >
      {children}
    </div>
  );
}
