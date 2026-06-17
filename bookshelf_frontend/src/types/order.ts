export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: number;
  book: number | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  title_snapshot: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  subtotal: string;
  shipping_fee: string;
  discount: string;
  total: string;
  coupon_code: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
}
