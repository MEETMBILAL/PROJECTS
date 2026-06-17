import { PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-bordercolor bg-surface-alt/50 px-6 py-16 text-center">
      <div className="mb-4 text-text-muted">
        {icon ?? <PackageOpen className="h-12 w-12" />}
      </div>
      <h3 className="font-display text-xl text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-secondary">
          {description}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
