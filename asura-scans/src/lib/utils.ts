import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

export function getCoverUrl(slug: string, width = 300, height = 400): string {
  return `https://picsum.photos/seed/${slug}/${width}/${height}`;
}

export function getPageUrl(slug: string, chapterNum: number, pageNum: number): string {
  return `https://picsum.photos/seed/${slug}-ch${chapterNum}-p${pageNum}/800/1200`;
}
