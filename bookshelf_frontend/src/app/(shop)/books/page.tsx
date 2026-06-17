import { Suspense } from "react";
import type { Metadata } from "next";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BooksPageClient } from "./BooksPageClient";

export const metadata: Metadata = {
  title: "Books",
  description: "Browse our full catalogue of books across all categories.",
};

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
      <BooksPageClient />
    </Suspense>
  );
}
