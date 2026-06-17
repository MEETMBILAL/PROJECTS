import type { ShippingAddress } from "./order";

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
  specification_detail: PODSpecification | null;
  file_url: string;
  file_name: string;
  page_count: number;
  copies: number;
  title: string;
  status: PODStatus;
  status_display: string;
  total_price: string;
  notes: string;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

export interface PODQuote {
  specification: string;
  page_count: number;
  copies: number;
  total_price: string;
}
