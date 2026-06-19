"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ExpandableText({
  text,
  className,
  clampLines = 4,
}: {
  text: string;
  className?: string;
  clampLines?: number;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={className}>
      <p
        className={cn(
          "text-sm leading-relaxed text-brand-text-secondary",
          !expanded && "line-clamp-4"
        )}
        style={!expanded ? { WebkitLineClamp: clampLines } : undefined}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-1 text-sm font-medium text-brand-purple-light hover:underline"
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
