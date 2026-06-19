"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SynopsisExpandProps {
  text: string;
  maxLength?: number;
}

export function SynopsisExpand({ text, maxLength = 300 }: SynopsisExpandProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = expanded || !shouldTruncate ? text : text.slice(0, maxLength) + "...";

  return (
    <div>
      <p className="text-sm leading-relaxed text-brand-text-secondary">{displayText}</p>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-brand-purple-light hover:text-brand-purple"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}
