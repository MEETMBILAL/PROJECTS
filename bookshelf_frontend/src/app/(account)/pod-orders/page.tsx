"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Printer } from "lucide-react";

import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { podApi } from "@/lib/api/pod";
import { formatPrice } from "@/lib/utils";

export default function PODOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.podOrders(),
    queryFn: podApi.orders,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl text-primary">Print Orders</h1>
      {!orders || orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Printer}
            title="No print orders yet"
            description="Upload a document to start a print-on-demand order."
            actionLabel="Start Printing"
            actionHref={ROUTES.pod}
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card-bs flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-medium text-text-primary">{order.title}</p>
                <p className="text-sm text-text-muted">
                  {order.page_count} pages · {order.copies} copies ·{" "}
                  {format(new Date(order.created_at), "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary">
                  {formatPrice(order.total_price)}
                </span>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
