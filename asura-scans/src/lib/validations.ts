import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const bookmarkSchema = z.object({
  comicId: z.string().min(1),
  lastReadChapter: z.number().optional(),
});

export const ratingSchema = z.object({
  comicId: z.string().min(1),
  value: z.number().int().min(1).max(10),
});

export const viewSchema = z.object({
  comicId: z.string().min(1),
  chapterId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
