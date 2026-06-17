import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-bsborder bg-surface-alt px-6 py-16 text-center">
      <Icon size={48} className="text-text-muted" />
      <h3 className="mt-4 text-xl text-primary">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-text-secondary">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
