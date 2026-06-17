import type { Book } from "./book";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cod" | "stripe" | "jazzcash";

export interface OrderItem {
  id: number;
  book: number | null;
  title_snapshot: string;
  cover_snapshot: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface ShippingAddress {
  recipient_name?: string;
  recipient_phone?: string;
  street: string;
  city: string;
  province: string;
  postal_code?: string;
  country?: string;
  [key: string]: unknown;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_display: string;
  payment_method: PaymentMethod;
  is_paid: boolean;
  shipping_address: ShippingAddress;
  subtotal: string;
  shipping_fee: string;
  discount: string;
  total: string;
  coupon_code: string;
  notes: string;
  tracking_number: string;
  total_items: number;
  items: OrderItem[];
  created_at: string;
}

export type { Book };
