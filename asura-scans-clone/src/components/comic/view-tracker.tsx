"use client";

import * as React from "react";

/** Fire-and-forget view increment when a comic detail page mounts. */
export function ViewTracker({ comicId }: { comicId: string }) {
  React.useEffect(() => {
    const key = `viewed:${comicId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comicId }),
      keepalive: true,
    }).catch(() => {});
  }, [comicId]);

  return null;
}
