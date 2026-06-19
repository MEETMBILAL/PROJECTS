import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@/types/comic";

const labels: Record<ComicStatus, string> = {
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  HIATUS: "HIATUS"
};

export function StatusBadge({ status }: { status: ComicStatus }) {
  const variant = status === "COMPLETED" ? "completed" : status === "HIATUS" ? "secondary" : "outline";
  return <Badge variant={variant}>{labels[status]}</Badge>;
}
