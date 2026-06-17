"use client";

import { useAuth } from "@/hooks/useAuth";

/** Keeps the Axios client's auth tokens in sync with the NextAuth session. */
export function AuthTokenSync() {
  useAuth();
  return null;
}
