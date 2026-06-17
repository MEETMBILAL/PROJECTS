import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

export interface StripeIntentResult {
  mock: boolean;
  client_secret: string;
}

export interface JazzCashResult {
  mock: boolean;
  payload: Record<string, string>;
  secure_hash: string;
}

export const paymentsApi = {
  async createStripeIntent(orderNumber: string): Promise<StripeIntentResult> {
    const { data } = await apiClient.post<ApiResponse<StripeIntentResult>>(
      "/payments/stripe/intent/",
      { order_number: orderNumber },
    );
    return data.data;
  },

  async initiateJazzCash(orderNumber: string): Promise<JazzCashResult> {
    const { data } = await apiClient.post<ApiResponse<JazzCashResult>>(
      "/payments/jazzcash/initiate/",
      { order_number: orderNumber },
    );
    return data.data;
  },
};
