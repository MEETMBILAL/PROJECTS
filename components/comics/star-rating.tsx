import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ rating, count, interactive = false, className }: { rating: number; count?: number; interactive?: boolean; className?: string }) {
  const rounded = Math.round(rating / 2);
  return (
    <div className={cn('flex items-center gap-1 text-sm text-brand-rating', className)} aria-label={`Rating ${rating.toFixed(1)} out of 10`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={cn('h-4 w-4', index < rounded ? 'fill-brand-rating' : 'fill-transparent text-brand-muted')} />
      ))}
      <span className="ml-1 font-semibold text-white">{rating.toFixed(1)}</span>
      {count !== undefined ? <span className="text-brand-muted">({count.toLocaleString()})</span> : null}
      {interactive ? <span className="sr-only">Interactive rating control</span> : null}
    </div>
  );
}
