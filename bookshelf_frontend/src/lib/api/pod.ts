import { apiClient, unwrap } from "./client";
import type { PODOrder, PODQuote, PODSpecification } from "@/types/pod";
import type { ShippingAddress } from "@/types/order";

export interface CreatePODOrderPayload {
  specification: number;
  file_url: string;
  file_name: string;
  page_count: number;
  copies: number;
  title: string;
  notes?: string;
  shipping_address?: ShippingAddress | null;
}

export const podApi = {
  specifications: () =>
    unwrap<PODSpecification[]>(apiClient.get("/pod/specifications/")),

  quote: (specificationId: number, pageCount: number, copies: number) =>
    unwrap<PODQuote>(
      apiClient.post("/pod/specifications/quote/", {
        specification_id: specificationId,
        page_count: pageCount,
        copies,
      }),
    ),

  orders: () => unwrap<PODOrder[]>(apiClient.get("/pod/orders/")),

  order: (id: number) => unwrap<PODOrder>(apiClient.get(`/pod/orders/${id}/`)),

  create: (payload: CreatePODOrderPayload) =>
    unwrap<PODOrder>(apiClient.post("/pod/orders/", payload)),

  uploadSignature: () =>
    unwrap<Record<string, unknown>>(apiClient.post("/pod/upload/")),
};
