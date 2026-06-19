import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="asura-container py-8">
      <Skeleton className="h-[420px] w-full rounded-xl bg-brand-card" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4] rounded-lg bg-brand-card" />
        ))}
      </div>
    </div>
  );
}
