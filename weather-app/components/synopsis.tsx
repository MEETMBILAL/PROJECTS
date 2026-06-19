"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Synopsis({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className={cn("text-sm leading-7 text-brand-textSecondary", !expanded && "line-clamp-3")}>{text}</p>
      <Button variant="ghost" size="sm" className="mt-2 px-0 text-brand-accentLight" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}
