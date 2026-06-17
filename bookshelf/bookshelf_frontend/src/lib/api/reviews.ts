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
  list: (slug: string) =>
    unwrap<Review[] | { results: Review[] }>(
      apiClient.get<ApiEnvelope<Review[] | { results: Review[] }>>(
        `/books/${slug}/reviews/`,
      ),
    ),

  create: (slug: string, input: ReviewInput) =>
    unwrap<Review>(
      apiClient.post<ApiEnvelope<Review>>(
        `/books/${slug}/reviews/`,
        input,
      ),
    ),

  remove: (id: number) => apiClient.delete(`/reviews/${id}/`),
};
