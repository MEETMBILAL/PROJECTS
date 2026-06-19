"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SearchResult } from "@/lib/search";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.results ?? []))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeading>
        {q ? `Results for "${q}"` : "Search"}
      </SectionHeading>

      {loading && (
        <p className="text-brand-text-secondary">Searching...</p>
      )}

      {!loading && q && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-brand-text-secondary text-lg">
            No results found for &quot;{q}&quot;
          </p>
          <Link href="/browse" className="text-brand-purple-light hover:underline mt-4 inline-block">
            Browse all comics
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((r) => (
          <Link
            key={r.id}
            href={`/comics/${r.slug}`}
            className="flex items-center gap-4 p-4 bg-brand-card rounded-cover hover:bg-brand-card-hover transition-colors"
          >
            <div className="relative w-16 aspect-cover rounded overflow-hidden flex-shrink-0">
              <Image src={r.coverImage} alt="" fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="font-medium text-white">{r.title}</p>
              {r.latestChapter && (
                <p className="text-sm text-brand-text-secondary">
                  Chapter {r.latestChapter}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
