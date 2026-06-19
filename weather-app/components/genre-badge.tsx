import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <Badge asChild variant="outline" className="hover:bg-brand-primary/15">
      <Link href={`/browse?genre=${encodeURIComponent(genre)}`}>{genre}</Link>
    </Badge>
  );
}
