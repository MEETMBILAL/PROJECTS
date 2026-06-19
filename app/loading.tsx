import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container space-y-8 pt-24">
      <Skeleton className="h-80 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, index) => <Skeleton key={index} className="aspect-[3/4] rounded-lg" />)}
      </div>
    </main>
  );
}
