export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, unknown> | null;
}

export interface Paginated<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
