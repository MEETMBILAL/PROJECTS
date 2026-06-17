import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { ReviewInput } from "@/lib/validations";

export interface Review {
  id: number;
  book: number;
  user: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export const reviewsApi = {
  async list(slug: string): Promise<Review[]> {
    const { data } = await apiClient.get<ApiEnvelope<Review[]>>(
      `/books/${slug}/reviews/`,
    );
    return unwrap(data);
  },

  async create(slug: string, payload: ReviewInput): Promise<Review> {
    const { data } = await apiClient.post<ApiEnvelope<Review>>(
      `/books/${slug}/reviews/`,
      payload,
    );
    return unwrap(data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/reviews/${id}/`);
  },
};
