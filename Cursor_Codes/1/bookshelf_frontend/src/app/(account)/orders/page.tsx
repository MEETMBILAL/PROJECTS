"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/constants/queryKeys";
import { AuthGuard } from "@/components/common/AuthGuard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/common/Badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import type { OrderStatus } from "@/types/order";

const STATUS_VARIANT: Record<
  OrderStatus,
  "primary" | "secondary" | "success" | "error" | "muted"
> = {
  pending: "muted",
  confirmed: "primary",
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
};

function OrdersContent() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: ordersApi.list,
  });

  if (isLoading) return <LoadingSpinner />;

  const orders = data?.results ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-text-primary">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order it will show up here."
          actionLabel="Start Shopping"
          actionHref={ROUTES.books}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={ROUTES.order(order.order_number)}
              className="card flex flex-wrap items-center justify-between gap-3 p-4 hover:border-primary"
            >
              <div>
                <p className="font-mono text-sm font-medium text-text-primary">
                  {order.order_number}
                </p>
                <p className="text-xs text-text-muted">
                  {formatDate(order.created_at)} · {order.items.length} items
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[order.status]}>
                {order.status}
              </Badge>
              <span className="font-semibold text-primary">
                {formatPrice(order.total)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
