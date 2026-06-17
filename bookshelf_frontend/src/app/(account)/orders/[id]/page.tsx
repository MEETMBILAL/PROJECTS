"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { queryKeys } from "@/constants/queryKeys";
import { ordersApi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.detail(id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(id) });
      toast.success("Order cancelled");
    },
    onError: (error: ApiError) => toast.error(error.message),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <p>Order not found.</p>;

  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Order {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <StatusBadge status={order.status} label={order.status_display} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y divide-bsborder p-5">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                {item.cover_snapshot && (
                  <Image
                    src={item.cover_snapshot}
                    alt={item.title_snapshot}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.title_snapshot}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {item.quantity} × {formatPrice(item.unit_price)}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.total_price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-display text-lg font-semibold">Summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={formatPrice(order.shipping_fee)} />
              {parseFloat(order.discount) > 0 && (
                <Row label="Discount" value={`- ${formatPrice(order.discount)}`} />
              )}
              <div className="flex justify-between border-t border-bsborder pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="text-primary">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-text-muted">
              Payment: {order.payment_method_display} ({order.payment_status})
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-display text-lg font-semibold">Shipping Address</h3>
            <address className="mt-3 text-sm not-italic text-text-secondary">
              {order.shipping_address.recipient_name && (
                <p className="font-medium text-text-primary">
                  {order.shipping_address.recipient_name}
                </p>
              )}
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.province}
              </p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
            </address>
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="btn-outline w-full border-error text-error hover:bg-error hover:text-white"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-secondary">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
