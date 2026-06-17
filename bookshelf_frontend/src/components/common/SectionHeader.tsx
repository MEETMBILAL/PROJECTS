import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
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
        <h2 className="font-display text-3xl font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-1.5 text-text-secondary">{subtitle}</p>}
      </div>
      {href && align === "left" && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
        >
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
