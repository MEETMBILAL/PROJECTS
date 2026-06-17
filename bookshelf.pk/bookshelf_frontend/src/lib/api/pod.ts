import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type {
  PODOrder,
  PODPriceResult,
  PODSpecification,
} from "@/types/pod";

export interface CreatePODOrderPayload {
  specification: number;
  title: string;
  page_count: number;
  copies: number;
  file_url: string;
  file_name: string;
  notes?: string;
  shipping_address?: Record<string, unknown> | null;
}

export const podApi = {
  async specifications(): Promise<PODSpecification[]> {
    const { data } = await apiClient.get<ApiEnvelope<PODSpecification[]>>(
      "/pod/specifications/",
    );
    return unwrap(data);
  },

  async calculate(
    specificationId: number,
    pageCount: number,
    copies: number,
  ): Promise<PODPriceResult> {
    const { data } = await apiClient.post<ApiEnvelope<PODPriceResult>>(
      "/pod/specifications/calculate/",
      {
        specification_id: specificationId,
        page_count: pageCount,
        copies,
      },
    );
    return unwrap(data);
  },

  async orders(): Promise<Paginated<PODOrder>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<PODOrder>>>(
      "/pod/orders/",
    );
    return unwrap(data);
  },

  async createOrder(payload: CreatePODOrderPayload): Promise<PODOrder> {
    const { data } = await apiClient.post<ApiEnvelope<PODOrder>>(
      "/pod/orders/",
      payload,
    );
    return unwrap(data);
  },

  async signUpload(): Promise<Record<string, unknown>> {
    const { data } = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
      "/pod/upload/",
    );
    return unwrap(data);
  },
};
