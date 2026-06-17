"use client";

import { useQuery } from "@tanstack/react-query";

import { booksApi, type BookQueryParams } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";

export function useBooks(params: BookQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.books(params),
    queryFn: () => booksApi.list(params),
  });
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: queryKeys.book(slug),
    queryFn: () => booksApi.detail(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedBooks(slug: string) {
  return useQuery({
    queryKey: queryKeys.relatedBooks(slug),
    queryFn: () => booksApi.related(slug),
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: booksApi.categories,
  });
}
