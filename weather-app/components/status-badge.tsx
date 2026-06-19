import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@/lib/mock-data";

const variants = {
  ONGOING: "new",
  COMPLETED: "completed",
  HIATUS: "secondary",
} as const;

export function StatusBadge({ status }: { status: ComicStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
