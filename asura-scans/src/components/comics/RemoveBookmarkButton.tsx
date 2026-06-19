"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RemoveBookmarkButtonProps {
  bookmarkId: string;
}

export function RemoveBookmarkButton({ bookmarkId }: RemoveBookmarkButtonProps) {
  const [removing, setRemoving] = useState(false);

  const remove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    try {
      await fetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
      window.location.reload();
    } catch {
      setRemoving(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={remove}
      disabled={removing}
      className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Remove bookmark"
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
