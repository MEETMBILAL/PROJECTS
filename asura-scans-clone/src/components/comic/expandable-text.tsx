"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ExpandableText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = text.length > 320;

  return (
    <div className={className}>
      <p
        className={cn(
          "whitespace-pre-line text-sm leading-relaxed text-brand-text-secondary",
          !expanded && isLong && "line-clamp-4",
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm font-medium text-brand-purple-light hover:underline"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
