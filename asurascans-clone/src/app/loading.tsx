import { ComicCardSkeleton } from "@/components/comic-card";

export default function Loading() {
  return (
    <div className="container max-w-screen-2xl space-y-10 py-6">
      <div className="h-[340px] w-full animate-pulse rounded-lg bg-brand-card sm:h-[420px] lg:h-[480px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ComicCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
