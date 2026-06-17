import { Suspense } from "react";
import type { Metadata } from "next";

import { BooksClient } from "./BooksClient";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse our full catalogue of books across every category.",
};

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
      <BooksClient />
    </Suspense>
  );
}
