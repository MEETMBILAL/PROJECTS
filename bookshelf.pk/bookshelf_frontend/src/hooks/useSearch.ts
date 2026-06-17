"use client";

import { useQuery } from "@tanstack/react-query";

import { booksApi } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";

export function useSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => booksApi.search(query),
    enabled: query.trim().length > 1,
  });
}
