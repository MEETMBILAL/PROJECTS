import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

export function getCoverUrl(slug: string, width = 300, height = 400): string {
  return `https://picsum.photos/seed/${slug}/${width}/${height}`;
}

export function getChapterPageUrl(
  comicSlug: string,
  chapterNum: number,
  pageNum: number
): string {
  return `https://picsum.photos/seed/${comicSlug}-ch${chapterNum}-p${pageNum}/800/1200`;
}
