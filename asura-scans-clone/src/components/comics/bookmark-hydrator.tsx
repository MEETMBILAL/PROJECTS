"use client";

import * as React from "react";
import { useBookmarkStore } from "@/store/bookmark-store";

/** Hydrates the client bookmark store with the user's bookmarked comic ids. */
export function BookmarkHydrator({ ids }: { ids: string[] }) {
  const setInitial = useBookmarkStore((s) => s.setInitial);
  React.useEffect(() => {
    setInitial(ids);
  }, [ids, setInitial]);
  return null;
}
