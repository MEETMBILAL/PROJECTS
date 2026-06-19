import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@/types";

const STATUS_MAP: Record<ComicStatus, { label: string; variant: "ongoing" | "completed" | "hiatus" }> = {
  ONGOING: { label: "Ongoing", variant: "ongoing" },
  COMPLETED: { label: "Completed", variant: "completed" },
  HIATUS: { label: "Hiatus", variant: "hiatus" },
};

export function StatusBadge({ status }: { status: ComicStatus }) {
  const cfg = STATUS_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function TypeBadge({ type }: { type: string }) {
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return <Badge variant="type">{label}</Badge>;
}
