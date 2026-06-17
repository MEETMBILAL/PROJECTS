import Link from "next/link";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt px-6 py-16 text-center">
      <div className="mb-4 text-ink-muted">
        {icon ?? <PackageOpen className="h-12 w-12" />}
      </div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-ink-secondary">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
