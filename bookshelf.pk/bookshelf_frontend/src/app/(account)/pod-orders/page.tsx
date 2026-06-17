"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Printer } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { podApi } from "@/lib/api/pod";
import { formatPrice } from "@/lib/utils";

export default function PODOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.podOrders(),
    queryFn: podApi.orders,
  });

  const orders = data?.results ?? [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink">Print Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No print orders yet"
          description="Upload a document to create your first Print-on-Demand order."
          icon={<Printer className="h-12 w-12" />}
          actionLabel="Start printing"
          actionHref={ROUTES.pod}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-mono text-sm font-medium text-primary">
                  {order.pod_number}
                </p>
                <p className="font-medium text-ink">{order.title}</p>
                <p className="text-sm text-ink-secondary">
                  {order.page_count} pages · {order.copies} copies ·{" "}
                  {format(new Date(order.created_at), "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-ink">
                  {formatPrice(order.total_price)}
                </span>
                <StatusBadge
                  status={order.status}
                  label={order.status_display}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
