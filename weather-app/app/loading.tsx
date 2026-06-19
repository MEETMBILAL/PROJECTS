import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-shell space-y-6 py-10">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton key={index} className="cover-aspect rounded-lg" />
        ))}
      </div>
    </div>
  );
}
