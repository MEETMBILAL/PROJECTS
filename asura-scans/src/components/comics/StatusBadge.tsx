import { Badge } from "@/components/ui/badge";
import { ComicStatus } from "@prisma/client";

const statusConfig: Record<
  ComicStatus,
  { label: string; variant: "default" | "completed" | "secondary" }
> = {
  ONGOING: { label: "Ongoing", variant: "default" },
  COMPLETED: { label: "Completed", variant: "completed" },
  HIATUS: { label: "Hiatus", variant: "secondary" },
};

interface StatusBadgeProps {
  status: ComicStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
