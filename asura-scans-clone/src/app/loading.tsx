import { Skeleton } from "@/components/ui/skeleton";
import { ComicGridSkeleton } from "@/components/comic/comic-grid";

export default function Loading() {
  return (
    <div className="container space-y-10 py-6">
      <Skeleton className="h-[340px] w-full rounded-lg sm:h-[420px] md:h-[460px]" />
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <ComicGridSkeleton count={6} />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <ComicGridSkeleton count={6} showChapters />
      </div>
    </div>
  );
}
