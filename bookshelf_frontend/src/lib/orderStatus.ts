import type { BadgeProps } from "@/components/common/Badge";
import type { OrderStatus, PODStatus } from "@/types";

export const STATUS_VARIANT: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "warning",
  confirmed: "primary",
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "error",
  refunded: "muted",
};

export const POD_STATUS_VARIANT: Record<PODStatus, BadgeProps["variant"]> = {
  draft: "muted",
  submitted: "warning",
  reviewing: "primary",
  printing: "secondary",
  shipped: "secondary",
  delivered: "success",
};
