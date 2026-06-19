export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-brand-card rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-cover bg-brand-card rounded-cover animate-pulse" />
            <div className="h-4 bg-brand-card rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
