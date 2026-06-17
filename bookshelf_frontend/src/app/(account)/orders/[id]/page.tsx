"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils";
import { STATUS_VARIANT } from "@/lib/orderStatus";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(params.id),
    queryFn: () => ordersApi.detail(params.id),
  });

  const cancel = async () => {
    try {
      await ordersApi.cancel(params.id);
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: queryKeys.order(params.id) });
    } catch {
      toast.error("Could not cancel this order");
    }
  };

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

  const canCancel = ["pending", "confirmed", "processing"].includes(order.status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl text-primary">{order.order_number}</h1>
          <p className="text-sm text-text-secondary">
            Placed on {format(new Date(order.created_at), "dd MMM yyyy")}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
      </div>

      <div className="card-bs overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-left text-text-secondary">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-bsborder">
                <td className="px-4 py-3 text-text-primary">{item.title_snapshot}</td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{formatPrice(item.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-bs p-5">
          <h3 className="mb-2 font-medium text-text-primary">Shipping address</h3>
          <div className="text-sm text-text-secondary">
            <p className="text-text-primary">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.phone}</p>
            <p>
              {order.shipping_address.street}, {order.shipping_address.city},{" "}
              {order.shipping_address.province}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>

        <div className="card-bs flex flex-col gap-2 p-5">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Shipping" value={formatPrice(order.shipping_fee)} />
          {parseFloat(order.discount) > 0 && (
            <Row label="Discount" value={`- ${formatPrice(order.discount)}`} />
          )}
          <div className="border-t border-bsborder pt-2">
            <Row label="Total" value={formatPrice(order.total)} bold />
          </div>
        </div>
      </div>

      {canCancel && (
        <button type="button" onClick={cancel} className="btn-outline w-fit border-error text-error hover:bg-error hover:text-surface">
          Cancel order
        </button>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold text-text-primary" : "text-text-secondary"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-semibold text-primary" : "text-text-primary"}>
        {value}
      </span>
    </div>
  );
}
