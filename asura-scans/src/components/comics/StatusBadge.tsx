import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig: Record<ComicStatus, { label: string; variant: "default" | "completed" | "secondary" }> = {
  ONGOING: { label: "Ongoing", variant: "default" },
  COMPLETED: { label: "Completed", variant: "completed" },
  HIATUS: { label: "Hiatus", variant: "secondary" },
};

interface StatusBadgeProps {
  status: ComicStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
