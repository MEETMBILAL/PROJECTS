import { Badge } from "@/components/ui/badge";
import type { ComicStatus, ComicType } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<ComicStatus, { label: string; variant: "new" | "completed" | "gold" }> = {
  ONGOING: { label: "Ongoing", variant: "new" },
  COMPLETED: { label: "Completed", variant: "completed" },
  HIATUS: { label: "Hiatus", variant: "gold" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ComicStatus;
  className?: string;
}) {
  const { label, variant } = STATUS_MAP[status];
  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  );
}

export function TypeBadge({
  type,
  className,
}: {
  type: ComicType;
  className?: string;
}) {
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return (
    <Badge variant="surface" className={cn(className)}>
      {label}
    </Badge>
  );
}
