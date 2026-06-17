import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type { Order } from "@/types/order";
import type { CheckoutInput } from "@/lib/validations";

export const ordersApi = {
  list: () =>
    unwrap<Paginated<Order>>(
      apiClient.get<ApiEnvelope<Paginated<Order>>>("/orders/"),
    ),

  detail: (orderNumber: string) =>
    unwrap<Order>(
      apiClient.get<ApiEnvelope<Order>>(`/orders/${orderNumber}/`),
    ),

  create: (input: CheckoutInput) => {
    const {
      payment_method,
      notes,
      coupon_code,
      ...address
    } = input;
    return unwrap<Order>(
      apiClient.post<ApiEnvelope<Order>>("/orders/create/", {
        shipping_address: address,
        payment_method,
        notes,
        coupon_code,
        contact_phone: address.phone,
      }),
    );
  },

  cancel: (orderNumber: string) =>
    unwrap<Order>(
      apiClient.post<ApiEnvelope<Order>>(`/orders/${orderNumber}/cancel/`),
    ),
};
