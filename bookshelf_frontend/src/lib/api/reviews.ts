import { apiClient, unwrap } from "./client";
import type { Review } from "@/types/book";

export interface ReviewPayload {
  rating: number;
  title?: string;
  comment?: string;
}

export const reviewsApi = {
  list: (slug: string) =>
    unwrap<Review[]>(apiClient.get(`/books/${slug}/reviews/`)),

  create: (slug: string, payload: ReviewPayload) =>
    unwrap<Review>(apiClient.post(`/books/${slug}/reviews/`, payload)),

  update: (id: number, payload: ReviewPayload) =>
    unwrap<Review>(apiClient.patch(`/reviews/${id}/`, payload)),

  remove: (id: number) => apiClient.delete(`/reviews/${id}/`),
};
