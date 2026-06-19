"use client";

import * as React from "react";

/** Fires a single view increment for a comic (and optionally a chapter). */
export function ViewTracker({
  comicId,
  chapterId,
}: {
  comicId: string;
  chapterId?: string;
}) {
  React.useEffect(() => {
    const key = `viewed:${comicId}:${chapterId ?? "comic"}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId, chapterId }),
      keepalive: true,
    }).catch(() => {});
  }, [comicId, chapterId]);

  return null;
}
