import { Skeleton } from "@/components/ui/skeleton";

export default function ComicLoading() {
  return (
    <div>
      <Skeleton className="h-48 w-full rounded-none sm:h-64" />
      <div className="container -mt-28 pb-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          <Skeleton className="mx-auto aspect-cover w-44 md:mx-0 md:w-full" />
          <div className="space-y-4 md:pt-28">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
        </div>
        <Skeleton className="mt-10 h-32 w-full" />
        <Skeleton className="mt-6 h-96 w-full" />
      </div>
    </div>
  );
}
