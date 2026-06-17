export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const SITE_NAME = "Bookshelf.pk";

export const CURRENCY = "PKR";

export const FREE_SHIPPING_THRESHOLD = 3000;
export const DEFAULT_SHIPPING_FEE = 200;

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
  "Islamabad Capital Territory",
] as const;

export const BOOK_FORMATS = [
  { value: "paperback", label: "Paperback" },
  { value: "hardcover", label: "Hardcover" },
  { value: "ebook", label: "E-Book" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "bestseller", label: "Best Selling" },
  { value: "rating", label: "Top Rated" },
] as const;
