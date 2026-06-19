import { Skeleton } from "@/components/ui/skeleton";

export function BrowseSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Skeleton className="mb-6 h-8 w-48" />
      <Skeleton className="mb-6 h-40 w-full rounded-modal" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-cover w-full rounded-cover" />
        ))}
      </div>
    </div>
  );
}
