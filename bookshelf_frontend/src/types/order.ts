export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cod" | "stripe" | "jazzcash";

export interface ShippingAddress {
  label?: string;
  recipient_name?: string;
  phone?: string;
  email?: string;
  street: string;
  city: string;
  province: string;
  postal_code?: string;
  country?: string;
}

export interface OrderItem {
  id: number;
  book: number | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  title_snapshot: string;
  cover_snapshot: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_display: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  payment_status: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  subtotal: string;
  shipping_fee: string;
  discount: string;
  total: string;
  coupon_code: string;
  notes: string;
  tracking_number: string;
  items: OrderItem[];
  created_at: string;
}
