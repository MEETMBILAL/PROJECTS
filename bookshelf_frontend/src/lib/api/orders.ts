import { apiClient, unwrap } from "./client";
import type { Paginated } from "@/types/api";
import type { Order, PaymentMethod, ShippingAddress } from "@/types/order";

export interface CreateOrderPayload {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
}

export const ordersApi = {
  list: () => unwrap<Paginated<Order>>(apiClient.get("/orders/")),

  detail: (orderNumber: string) =>
    unwrap<Order>(apiClient.get(`/orders/${orderNumber}/`)),

  create: (payload: CreateOrderPayload) =>
    unwrap<Order>(apiClient.post("/orders/create/", payload)),

  cancel: (orderNumber: string) =>
    unwrap<Order>(apiClient.post(`/orders/${orderNumber}/cancel/`)),
};
