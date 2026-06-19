import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function GenreBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Badge asChild variant="outline" className="border-brand-primary/60 bg-brand-primary/10 text-brand-light hover:bg-brand-primary hover:text-white">
      <Link href={`/browse?genres=${slug}`}>{name}</Link>
    </Badge>
  );
}
