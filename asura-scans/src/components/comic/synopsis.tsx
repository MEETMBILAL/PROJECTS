"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Synopsis({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 280;

  return (
    <div>
      <p
        className={cn(
          "text-sm leading-relaxed text-brand-text-secondary",
          !expanded && isLong && "line-clamp-3",
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-sm font-medium text-brand-purple-light transition-colors hover:text-brand-purple"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
