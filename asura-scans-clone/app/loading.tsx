import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-shell py-10">
      <Skeleton className="h-[420px] w-full rounded-xl" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
