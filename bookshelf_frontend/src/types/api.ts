export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: unknown | null;
  data: T;
}

export interface PaginatedData<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
