"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SynopsisExpandProps {
  text: string;
}

export function SynopsisExpand({ text }: SynopsisExpandProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 300;

  return (
    <div>
      <p
        className={`text-sm text-brand-secondary leading-relaxed ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 gap-1 text-brand-purple p-0 h-auto"
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
        </Button>
      )}
    </div>
  );
}
