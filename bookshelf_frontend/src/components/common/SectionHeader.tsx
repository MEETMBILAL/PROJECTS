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
        <h2 className="text-3xl text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-text-secondary">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-secondary hover:text-primary"
        >
          View all <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
