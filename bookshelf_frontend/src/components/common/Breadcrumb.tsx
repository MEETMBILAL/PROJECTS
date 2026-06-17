import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: ROUTES.home }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-text-secondary">
      {all.map((item, index) => {
        const isLast = index === all.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="text-text-muted" />}
          </span>
        );
      })}
    </nav>
  );
}
