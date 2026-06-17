import { API_URL } from "@/constants/config";
import type { ApiResponse, BookDetail, Category } from "@/types";

/**
 * Server-side fetch helpers for public (unauthenticated) data.
 * Uses the native fetch API so Next.js can cache/revalidate responses.
 */
async function getJson<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as ApiResponse<T>;
    return payload.data;
  } catch {
    return null;
  }
}

export const serverApi = {
  book: (slug: string) => getJson<BookDetail>(`/books/${slug}/`),
  category: (slug: string) => getJson<Category>(`/categories/${slug}/`),
  categories: () => getJson<Category[]>(`/categories/`),
};
