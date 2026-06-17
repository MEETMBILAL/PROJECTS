"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders(),
    queryFn: ordersApi.list,
  });

  const orders = data?.results ?? [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order it will appear here."
          actionLabel="Start shopping"
          actionHref={ROUTES.books}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-ink-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-surface-alt">
                  <td className="px-4 py-3">
                    <Link
                      href={ROUTES.order(order.order_number)}
                      className="font-mono font-medium text-primary"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {format(new Date(order.created_at), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {order.total_items}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={order.status}
                      label={order.status_display}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
