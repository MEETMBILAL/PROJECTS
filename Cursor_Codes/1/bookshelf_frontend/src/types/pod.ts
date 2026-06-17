export interface PODSpecification {
  id: number;
  name: string;
  paper_size: string;
  binding: string;
  cover_type: string;
  color_mode: string;
  price_per_page: string;
  min_pages: number;
  max_pages: number;
  setup_fee: string;
}

export type PODStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "printing"
  | "shipped"
  | "delivered";

export interface PODOrder {
  id: number;
  specification: number;
  specification_detail?: PODSpecification;
  file_url: string;
  file_name: string;
  page_count: number;
  copies: number;
  title: string;
  status: PODStatus;
  total_price: string;
  notes: string;
  created_at: string;
}

export interface PODQuote {
  specification: number;
  page_count: number;
  copies: number;
  unit_price: string;
  total_price: string;
  currency: string;
}
