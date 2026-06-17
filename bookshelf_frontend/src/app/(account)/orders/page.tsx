"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils";
import { STATUS_VARIANT } from "@/lib/orderStatus";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.orders(),
    queryFn: ordersApi.list,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl text-primary">My Orders</h1>
      {!orders || orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No orders yet"
            description="When you place an order it will appear here."
            actionLabel="Start Shopping"
            actionHref={ROUTES.books}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-bsborder">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-text-secondary">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-bsborder hover:bg-surface-alt">
                  <td className="px-4 py-3">
                    <Link
                      href={ROUTES.order(order.order_number)}
                      className="font-mono text-primary hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {format(new Date(order.created_at), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-primary">
                    {formatPrice(order.total)}
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
