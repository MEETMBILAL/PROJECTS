"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/constants/queryKeys";
import { AuthGuard } from "@/components/common/AuthGuard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/common/Badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

function OrderDetailContent({ id }: { id: string }) {
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.detail(id),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        actionLabel="Back to orders"
        actionHref={ROUTES.orders}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">
            Order Details
          </h1>
          <p className="font-mono text-sm text-text-muted">
            {order.order_number} · {formatDate(order.created_at)}
          </p>
        </div>
        <Badge variant="primary">{order.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y divide-bordercolor p-0">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  {item.title_snapshot}
                </p>
                <p className="text-sm text-text-secondary">
                  {item.quantity} × {formatPrice(item.unit_price)}
                </p>
              </div>
              <span className="font-semibold text-text-primary">
                {formatPrice(item.total_price)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card space-y-2 p-5 text-sm">
            <h3 className="font-display text-lg text-text-primary">Summary</h3>
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={formatPrice(order.shipping_fee)} />
            <Row label="Discount" value={`- ${formatPrice(order.discount)}`} />
            <div className="flex justify-between border-t border-bordercolor pt-2 font-semibold text-primary">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="card space-y-1 p-5 text-sm">
            <h3 className="mb-2 font-display text-lg text-text-primary">
              Shipping
            </h3>
            <p className="text-text-secondary">
              {order.shipping_address?.recipient_name}
            </p>
            <p className="text-text-secondary">
              {order.shipping_address?.street}, {order.shipping_address?.city}
            </p>
            <p className="text-text-secondary">
              {order.shipping_address?.province},{" "}
              {order.shipping_address?.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AuthGuard>
      <OrderDetailContent id={params.id} />
    </AuthGuard>
  );
}
