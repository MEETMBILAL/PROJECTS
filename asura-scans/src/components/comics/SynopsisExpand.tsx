"use client";

import { useState } from "react";

interface SynopsisExpandProps {
  synopsis: string;
}

export function SynopsisExpand({ synopsis }: SynopsisExpandProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = synopsis.length > 300;

  return (
    <div>
      <p
        className={`text-sm text-brand-text-secondary leading-relaxed ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {synopsis}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-brand-purple hover:text-brand-purple-light mt-2 transition-colors"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
