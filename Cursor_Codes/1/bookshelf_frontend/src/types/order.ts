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
  recipient_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
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
  payment_method: PaymentMethod;
  is_paid: boolean;
  shipping_address: ShippingAddress;
  contact_email: string;
  contact_phone: string;
  subtotal: string;
  shipping_fee: string;
  discount: string;
  total: string;
  coupon_code: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
}
