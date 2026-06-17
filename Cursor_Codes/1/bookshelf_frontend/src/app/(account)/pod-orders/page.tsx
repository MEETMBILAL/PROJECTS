"use client";

import { useQuery } from "@tanstack/react-query";
import { podApi } from "@/lib/api/pod";
import { queryKeys } from "@/constants/queryKeys";
import { AuthGuard } from "@/components/common/AuthGuard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/common/Badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Printer } from "lucide-react";

function PODOrdersContent() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.podOrders,
    queryFn: podApi.orders,
  });

  if (isLoading) return <LoadingSpinner />;

  const orders = data?.results ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-text-primary">
        POD Orders
      </h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No POD orders yet"
          description="Upload a document to print your first book."
          actionLabel="Start Printing"
          actionHref={ROUTES.pod}
          icon={<Printer className="h-12 w-12" />}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-medium text-text-primary">{order.title}</p>
                <p className="text-xs text-text-muted">
                  {order.page_count} pages · {order.copies} copies ·{" "}
                  {formatDate(order.created_at)}
                </p>
              </div>
              <Badge variant="primary">{order.status}</Badge>
              <span className="font-semibold text-primary">
                {formatPrice(order.total_price)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PODOrdersPage() {
  return (
    <AuthGuard>
      <PODOrdersContent />
    </AuthGuard>
  );
}
