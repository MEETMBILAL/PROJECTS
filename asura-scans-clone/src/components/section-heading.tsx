import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  href?: string;
  className?: string;
}

export function SectionHeading({ title, href, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <h2 className="border-l-[3px] border-brand-purple pl-3 text-lg font-bold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-sm font-medium text-brand-text-secondary transition-colors duration-150 hover:text-brand-purple-light"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
