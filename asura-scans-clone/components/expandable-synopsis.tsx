"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExpandableSynopsis({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className={cn("text-sm leading-7 text-brand-textSecondary", !expanded && "line-clamp-4")}>{text}</p>
      <Button variant="ghost" size="sm" className="mt-2 px-0 text-brand-accent" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}
