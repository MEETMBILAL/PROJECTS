import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={
        align === "center"
          ? "mb-8 flex flex-col items-center text-center"
          : "mb-8 flex items-end justify-between gap-4"
      }
    >
      <div>
        <h2 className="font-display text-3xl text-ink">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>
        )}
      </div>
      {viewAllHref && align === "left" && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-primary transition hover:gap-2"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
