import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@/lib/types";

const MAP: Record<ComicStatus, { label: string; variant: "new" | "completed" | "secondary" }> = {
  ONGOING: { label: "Ongoing", variant: "new" },
  COMPLETED: { label: "Completed", variant: "completed" },
  HIATUS: { label: "Hiatus", variant: "secondary" },
};

export function StatusBadge({ status, className }: { status: ComicStatus; className?: string }) {
  const { label, variant } = MAP[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
