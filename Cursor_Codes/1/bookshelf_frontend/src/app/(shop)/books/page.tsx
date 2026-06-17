import { Suspense } from "react";
import type { Metadata } from "next";
import { BooksClient } from "./BooksClient";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "Browse our full catalogue of Non-Fiction, Business, Self-Help, Fiction and Academic books.",
};

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading books…" />}>
      <BooksClient />
    </Suspense>
  );
}
