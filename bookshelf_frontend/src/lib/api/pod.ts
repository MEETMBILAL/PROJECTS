import { apiClient } from "./client";
import type {
  ApiResponse,
  PODOrder,
  PODSpecification,
  PODUploadSignature,
} from "@/types";

export interface CreatePODOrderPayload {
  specification: number;
  file_url: string;
  file_name: string;
  page_count: number;
  copies: number;
  title: string;
  notes?: string;
  shipping_address?: Record<string, unknown> | null;
}

export const podApi = {
  async specifications(): Promise<PODSpecification[]> {
    const { data } = await apiClient.get<ApiResponse<PODSpecification[]>>(
      "/pod/specifications/",
    );
    return data.data;
  },

  async calculatePrice(
    specificationId: number,
    pageCount: number,
    copies: number,
  ): Promise<string> {
    const { data } = await apiClient.post<ApiResponse<{ total_price: string }>>(
      "/pod/orders/calculate-price/",
      { specification_id: specificationId, page_count: pageCount, copies },
    );
    return data.data.total_price;
  },

  async uploadSignature(): Promise<PODUploadSignature> {
    const { data } = await apiClient.post<ApiResponse<PODUploadSignature>>(
      "/pod/upload/",
    );
    return data.data;
  },

  async createOrder(payload: CreatePODOrderPayload): Promise<PODOrder> {
    const { data } = await apiClient.post<ApiResponse<PODOrder>>("/pod/orders/", payload);
    return data.data;
  },

  async orders(): Promise<PODOrder[]> {
    const { data } = await apiClient.get<
      ApiResponse<{ results: PODOrder[] } | PODOrder[]>
    >("/pod/orders/");
    const payload = data.data;
    if (Array.isArray(payload)) return payload;
    return payload.results ?? [];
  },
};
