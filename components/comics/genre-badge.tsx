import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <Badge variant="outline" className="hover:bg-brand-primary hover:text-white">
      <Link href={`/browse?genre=${encodeURIComponent(genre)}`}>{genre}</Link>
    </Badge>
  );
}
