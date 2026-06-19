import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GenreBadgeProps {
  name: string;
  slug: string;
  className?: string;
}

export function GenreBadge({ name, slug, className }: GenreBadgeProps) {
  return (
    <Link href={`/browse?genres=${slug}`}>
      <Badge variant="outline" className={cn("hover:bg-brand-purple/10 transition-colors cursor-pointer", className)}>
        {name}
      </Badge>
    </Link>
  );
}
