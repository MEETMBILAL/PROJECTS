import { Badge } from "./Badge";

const statusVariant: Record<string, "primary" | "secondary" | "success" | "error" | "muted"> = {
  pending: "muted",
  confirmed: "primary",
  processing: "primary",
  printing: "primary",
  reviewing: "secondary",
  submitted: "secondary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
  draft: "muted",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge variant={statusVariant[status] ?? "muted"}>
      {label ?? status}
    </Badge>
  );
}
