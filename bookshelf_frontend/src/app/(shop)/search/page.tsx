import { Suspense } from "react";
import type { Metadata } from "next";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
      <SearchPageClient />
    </Suspense>
  );
}
