import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <>
      <Skeleton className="h-[420px] w-full md:h-[500px]" />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={j} className="aspect-cover w-full rounded-cover" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
