import { ComicCardSkeleton } from "@/components/comic/comic-card";

export default function Loading() {
  return (
    <div>
      <div className="skeleton h-[420px] w-full sm:h-[480px] md:h-[540px]" />
      <div className="container space-y-10 py-10">
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s} className="space-y-4">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ComicCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
