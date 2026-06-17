export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const SITE = {
  name: "Bookshelf.pk",
  tagline: "Pakistan's Most Trusted Bookstore",
  description:
    "Online bookstore and Print-on-Demand platform for Pakistan. Non-Fiction, Business, Self-Help, Fiction and Academic books.",
  currency: "PKR",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
};

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "bestseller", label: "Best Selling" },
  { value: "popular", label: "Most Popular" },
  { value: "title", label: "Title A-Z" },
];

export const BOOK_FORMATS = [
  { value: "paperback", label: "Paperback" },
  { value: "hardcover", label: "Hardcover" },
  { value: "ebook", label: "E-Book" },
];

export const LANGUAGES = ["English", "Urdu", "Arabic"];
