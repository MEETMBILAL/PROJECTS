import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchClient />
    </Suspense>
  );
}
