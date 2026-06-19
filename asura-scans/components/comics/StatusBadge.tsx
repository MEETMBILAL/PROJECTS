import { cn } from "@/lib/utils";
import type { ComicStatus } from "@prisma/client";

const statusConfig: Record<ComicStatus, { label: string; className: string }> = {
  ONGOING: { label: "Ongoing", className: "bg-brand-badge-new/20 text-brand-badge-new border-brand-badge-new/40" },
  COMPLETED: { label: "Completed", className: "bg-brand-badge-completed/20 text-brand-badge-completed border-brand-badge-completed/40" },
  HIATUS: { label: "Hiatus", className: "bg-brand-gold/20 text-brand-gold border-brand-gold/40" },
};

interface StatusBadgeProps {
  status: ComicStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
