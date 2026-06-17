import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { booksApi, type BookListParams } from "@/lib/api/books";
import { queryKeys } from "@/constants/queryKeys";

export function useBooks(params: BookListParams = {}) {
  return useQuery({
    queryKey: queryKeys.books(params),
    queryFn: () => booksApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: queryKeys.book(slug),
    queryFn: () => booksApi.detail(slug),
    enabled: Boolean(slug),
  });
}

export function useFeaturedBooks() {
  return useQuery({ queryKey: queryKeys.featured(), queryFn: booksApi.featured });
}

export function useBestsellers() {
  return useQuery({ queryKey: queryKeys.bestsellers(), queryFn: booksApi.bestsellers });
}

export function useNewArrivals() {
  return useQuery({ queryKey: queryKeys.newArrivals(), queryFn: booksApi.newArrivals });
}

export function useRelatedBooks(slug: string) {
  return useQuery({
    queryKey: queryKeys.related(slug),
    queryFn: () => booksApi.related(slug),
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories(), queryFn: booksApi.categories });
}
