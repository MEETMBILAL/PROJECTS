import { apiClient } from "./client";
import type { ApiResponse, Order, PaginatedData, ShippingAddress } from "@/types";

export interface CreateOrderPayload {
  shipping_address: ShippingAddress;
  coupon_code?: string;
  notes?: string;
}

export const ordersApi = {
  async list(): Promise<Order[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Order>>>("/orders/");
    return data.data.results;
  },

  async detail(orderNumber: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${orderNumber}/`);
    return data.data;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>("/orders/create/", payload);
    return data.data;
  },

  async cancel(orderNumber: string): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderNumber}/cancel/`,
    );
    return data.data;
  },
};
