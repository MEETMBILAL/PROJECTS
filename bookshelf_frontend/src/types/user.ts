export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone: string;
  avatar: string;
  is_staff: boolean;
  date_joined: string;
}

export interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}
