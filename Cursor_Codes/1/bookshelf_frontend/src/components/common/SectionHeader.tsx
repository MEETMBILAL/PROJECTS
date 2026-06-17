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
      className={`mb-8 flex items-end justify-between gap-4 ${
        align === "center" ? "flex-col text-center" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto" : ""}>
        <h2 className="font-display text-3xl text-text-primary">{title}</h2>
        {subtitle ? (
          <p className="mt-1.5 text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}
