import { useQuery } from "@tanstack/react-query";

import { searchApi } from "@/lib/api/search";
import { queryKeys } from "@/constants/queryKeys";
import { useDebounce } from "./useDebounce";

export function useSearch(query: string) {
  const debounced = useDebounce(query, 300);
  return useQuery({
    queryKey: queryKeys.search(debounced),
    queryFn: () => searchApi.global(debounced),
    enabled: debounced.trim().length > 1,
  });
}
