import { z } from "zod";

import { PAKISTAN_PROVINCES } from "@/constants/config";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Please enter your full name"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const addressSchema = z.object({
  recipient_name: z.string().min(2, "Recipient name is required"),
  recipient_phone: z.string().min(7, "A valid phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.enum(PAKISTAN_PROVINCES, {
    errorMap: () => ({ message: "Select a province" }),
  }),
  postal_code: z.string().optional(),
  country: z.string().default("Pakistan"),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(3, "Please write a short review"),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const podOrderSchema = z.object({
  title: z.string().min(2, "Give your document a title"),
  specification: z.number({ invalid_type_error: "Choose a print specification" }),
  page_count: z.number().min(1, "Page count must be at least 1"),
  copies: z.number().min(1, "At least 1 copy is required"),
});
export type PODOrderInput = z.infer<typeof podOrderSchema>;
