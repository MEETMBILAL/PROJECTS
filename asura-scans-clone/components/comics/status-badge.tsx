import { Badge } from "@/components/ui/badge";
import type { ComicStatus } from "@/lib/types";

const styles: Record<ComicStatus, string> = {
  ONGOING: "border-brand-new/40 bg-brand-new/15 text-brand-new",
  COMPLETED: "border-brand-completed/40 bg-brand-completed/15 text-brand-completed",
  HIATUS: "border-brand-hot/40 bg-brand-hot/15 text-brand-hot",
};

export function StatusBadge({ status }: { status: ComicStatus }) {
  return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
}
