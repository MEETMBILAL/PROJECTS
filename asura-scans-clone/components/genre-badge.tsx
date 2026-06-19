import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type GenreBadgeProps = {
  name: string;
  slug: string;
};

export function GenreBadge({ name, slug }: GenreBadgeProps) {
  return (
    <Badge variant="outline" className="hover:bg-brand-primary/20">
      <Link href={`/browse?genre=${slug}`}>{name}</Link>
    </Badge>
  );
}
