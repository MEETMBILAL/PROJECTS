"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface RemoveBookmarkButtonProps {
  bookmarkId: string;
}

export function RemoveBookmarkButton({ bookmarkId }: RemoveBookmarkButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await fetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="absolute top-2 left-2 p-1.5 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-badge-hot"
      aria-label="Remove bookmark"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
