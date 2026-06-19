import { ComicGridSkeleton } from "@/components/comics/comic-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-[420px] w-full rounded-none sm:h-[480px] lg:h-[540px]" />
      <div className="container space-y-12 py-10">
        <div>
          <Skeleton className="mb-4 h-7 w-48" />
          <ComicGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
