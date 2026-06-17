import { z } from "zod";

import { PROVINCES } from "@/constants/config";

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
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const addressSchema = z.object({
  recipient_name: z.string().min(2, "Recipient name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.enum(PROVINCES as [string, ...string[]], {
    errorMap: () => ({ message: "Select a province" }),
  }),
  postal_code: z.string().optional(),
  country: z.string().default("Pakistan"),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = addressSchema.extend({
  email: z.string().email("Enter a valid email address"),
  payment_method: z.enum(["cod", "stripe", "jazzcash"]),
  notes: z.string().optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please choose a rating").max(5),
  title: z.string().optional(),
  comment: z.string().min(3, "Please write a short review"),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const podOrderSchema = z.object({
  title: z.string().min(2, "Give your document a title"),
  specification: z.number().min(1, "Choose a print specification"),
  page_count: z.number().min(1, "Page count is required"),
  copies: z.number().min(1, "At least one copy"),
  notes: z.string().optional(),
});
export type PODOrderInput = z.infer<typeof podOrderSchema>;
