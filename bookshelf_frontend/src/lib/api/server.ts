import { API_URL } from "@/constants/config";
import type { ApiEnvelope } from "@/types/api";
import type { Book } from "@/types/book";

/**
 * Server-side fetch helper (used in Server Components & generateMetadata).
 * Uses the native fetch with Next.js caching/revalidation.
 */
async function serverGet<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data;
  } catch {
    return null;
  }
}

export function getBookServer(slug: string) {
  return serverGet<Book>(`/books/${slug}/`);
}
