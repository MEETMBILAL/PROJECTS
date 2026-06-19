import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Relative timestamp helper — e.g. "2 hours ago", "last week". */
export function timeAgo(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diffMs >= 6 * day && diffMs < 14 * day) return "last week";
  return `${formatDistanceToNowStrict(d)} ago`;
}

/** Compact number formatting — 1.2K, 3.4M. */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

/** Build a chapter label like "Chapter 12" or "Chapter 12.5". */
export function chapterLabel(num: number, title?: string | null): string {
  const base = `Chapter ${Number.isInteger(num) ? num : num.toFixed(1)}`;
  return title ? `${base} - ${title}` : base;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Stable placeholder cover/page image (works without any external account). */
export function placeholderImage(seed: string | number, w = 400, h = 533): string {
  return `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;
}
