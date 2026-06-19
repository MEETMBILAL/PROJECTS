"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SynopsisExpandable({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 300;

  return (
    <div>
      <p
        className={`text-brand-text-secondary text-sm leading-relaxed ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-brand-purple-light text-sm mt-2 hover:text-brand-purple transition-colors"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
