import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/utils";
import type { ComicStatus } from "@/lib/types";

const VARIANT: Record<ComicStatus, "new" | "completed" | "hot"> = {
  ONGOING: "new",
  COMPLETED: "completed",
  HIATUS: "hot",
};

export function StatusBadge({ status, className }: { status: ComicStatus; className?: string }) {
  return (
    <Badge variant={VARIANT[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
