import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type { Order, PaymentMethod, ShippingAddress } from "@/types/order";

export interface CreateOrderPayload {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
}

export const ordersApi = {
  async list(): Promise<Paginated<Order>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Order>>>(
      "/orders/",
    );
    return unwrap(data);
  },

  async detail(orderNumber: string): Promise<Order> {
    const { data } = await apiClient.get<ApiEnvelope<Order>>(
      `/orders/${orderNumber}/`,
    );
    return unwrap(data);
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<ApiEnvelope<Order>>(
      "/orders/create/",
      payload,
    );
    return unwrap(data);
  },

  async cancel(orderNumber: string): Promise<Order> {
    const { data } = await apiClient.post<ApiEnvelope<Order>>(
      `/orders/${orderNumber}/cancel/`,
    );
    return unwrap(data);
  },
};
