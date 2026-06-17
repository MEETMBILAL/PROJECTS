import { Badge } from "./Badge";

const STATUS_VARIANTS: Record<string, "primary" | "secondary" | "success" | "error" | "muted"> = {
  pending: "muted",
  submitted: "muted",
  confirmed: "primary",
  reviewing: "secondary",
  processing: "secondary",
  printing: "secondary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
  draft: "muted",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "muted"}>
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
