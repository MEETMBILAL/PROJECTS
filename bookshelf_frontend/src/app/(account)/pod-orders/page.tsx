"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { podApi } from "@/lib/api/pod";
import { formatDate, formatPrice } from "@/lib/utils";

export default function PODOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.podOrders(),
    queryFn: podApi.orders,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-primary">Print Orders</h1>
        <Link href={ROUTES.pod} className="btn-primary">
          New Print Order
        </Link>
      </div>

      <div className="mt-6">
        {!data || data.length === 0 ? (
          <EmptyState
            title="No print orders yet"
            description="Upload a document to create your first print-on-demand order."
            icon={<Printer size={48} strokeWidth={1.5} />}
            actionLabel="Start Printing"
            actionHref={ROUTES.pod}
          />
        ) : (
          <div className="space-y-3">
            {data.map((order) => (
              <div
                key={order.id}
                className="card flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div>
                  <p className="font-medium text-text-primary">{order.title}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {order.specification_detail?.name} · {order.page_count} pages ×{" "}
                    {order.copies} · {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} label={order.status_display} />
                  <span className="font-semibold text-primary">
                    {formatPrice(order.total_price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
