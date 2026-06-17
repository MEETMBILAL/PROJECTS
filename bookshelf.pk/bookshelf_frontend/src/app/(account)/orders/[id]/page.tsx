"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderNumber = params.id;
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(orderNumber),
    queryFn: () => ordersApi.detail(orderNumber),
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(orderNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(orderNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() });
      toast.success("Order cancelled");
    },
    onError: (error: Error) => toast.error(error.message),
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

  const canCancel = ["pending", "confirmed", "processing"].includes(
    order.status,
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">
            Order{" "}
            <span className="font-mono text-primary">{order.order_number}</span>
          </h1>
          <p className="text-sm text-ink-secondary">
            Placed on {format(new Date(order.created_at), "dd MMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} label={order.status_display} />
          {canCancel && (
            <button
              type="button"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="btn-outline px-4 py-2 text-sm"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y divide-border p-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3">
              {item.cover_snapshot && (
                <div className="relative aspect-[2/3] w-14 flex-shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                  <Image
                    src={item.cover_snapshot}
                    alt={item.title_snapshot}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{item.title_snapshot}</p>
                  <p className="text-sm text-ink-secondary">
                    {item.quantity} × {formatPrice(item.unit_price)}
                  </p>
                </div>
                <span className="font-medium text-ink">
                  {formatPrice(item.total_price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-5">
            <h3 className="mb-3 font-display text-lg text-ink">Summary</h3>
            <dl className="flex flex-col gap-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={formatPrice(order.shipping_fee)} />
              {parseFloat(order.discount) > 0 && (
                <Row
                  label="Discount"
                  value={`- ${formatPrice(order.discount)}`}
                />
              )}
              <div className="my-1 border-t border-border" />
              <Row label="Total" value={formatPrice(order.total)} bold />
            </dl>
          </div>

          <div className="card p-5 text-sm text-ink-secondary">
            <h3 className="mb-2 font-display text-lg text-ink">Shipping</h3>
            <p>
              {order.shipping_address.recipient_name}
              <br />
              {order.shipping_address.street}, {order.shipping_address.city}
              <br />
              {order.shipping_address.province},{" "}
              {order.shipping_address.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold text-ink" : "text-ink-secondary"}>
        {label}
      </dt>
      <dd className={bold ? "text-lg font-semibold text-primary" : "text-ink"}>
        {value}
      </dd>
    </div>
  );
}
