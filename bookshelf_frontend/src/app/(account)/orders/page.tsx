"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ordersApi } from "@/lib/api/orders";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders(),
    queryFn: ordersApi.list,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">My Orders</h1>

      {!data || data.results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No orders yet"
            description="When you place an order it will appear here."
            actionLabel="Start Shopping"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {data.results.map((order) => (
            <Link
              key={order.id}
              href={ROUTES.order(order.order_number)}
              className="card flex items-center justify-between gap-4 p-5 transition-colors hover:border-primary"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-text-primary">
                  {order.order_number}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {formatDate(order.created_at)} · {order.items.length} item
                  {order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} label={order.status_display} />
                <span className="font-semibold text-primary">
                  {formatPrice(order.total)}
                </span>
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
