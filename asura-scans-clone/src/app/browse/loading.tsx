import { ComicGridSkeleton } from "@/components/comics/comic-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="mb-4 h-7 w-48" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <ComicGridSkeleton count={24} />
    </div>
  );
}
