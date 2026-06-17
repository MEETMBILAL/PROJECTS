import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { ReviewInput } from "@/lib/validations";

export interface Review {
  id: number;
  book: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export const reviewsApi = {
  async list(slug: string): Promise<Review[]> {
    const { data } = await apiClient.get<ApiResponse<{ results: Review[] } | Review[]>>(
      `/books/${slug}/reviews/`,
    );
    const payload = data.data;
    if (Array.isArray(payload)) return payload;
    return payload.results ?? [];
  },

  async create(slug: string, payload: ReviewInput): Promise<Review> {
    const { data } = await apiClient.post<ApiResponse<Review>>(
      `/books/${slug}/reviews/`,
      payload,
    );
    return data.data;
  },
};
