import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type { PODOrder, PODQuote, PODSpecification } from "@/types/pod";

export const podApi = {
  specifications: () =>
    unwrap<PODSpecification[]>(
      apiClient.get<ApiEnvelope<PODSpecification[]>>(
        "/pod/specifications/",
      ),
    ),

  quote: (specification: number, page_count: number, copies: number) =>
    unwrap<PODQuote>(
      apiClient.post<ApiEnvelope<PODQuote>>("/pod/quote/", {
        specification,
        page_count,
        copies,
      }),
    ),

  orders: () =>
    unwrap<Paginated<PODOrder>>(
      apiClient.get<ApiEnvelope<Paginated<PODOrder>>>("/pod/orders/"),
    ),

  createOrder: (payload: Partial<PODOrder>) =>
    unwrap<PODOrder>(
      apiClient.post<ApiEnvelope<PODOrder>>("/pod/orders/", payload),
    ),

  uploadSignature: () =>
    unwrap<Record<string, unknown>>(
      apiClient.post<ApiEnvelope<Record<string, unknown>>>("/pod/upload/"),
    ),
};
