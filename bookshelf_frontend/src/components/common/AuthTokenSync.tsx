"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { setAccessToken } from "@/lib/api/client";

/**
 * Keeps the Axios client's in-memory access token in sync with the NextAuth
 * session so authenticated requests work in the browser.
 */
export function AuthTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.accessToken ?? null);
  }, [session?.accessToken]);

  return null;
}
