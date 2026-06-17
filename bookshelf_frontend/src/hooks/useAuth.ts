"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { setAuthTokens } from "@/lib/api/client";

export function useAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    setAuthTokens(session?.accessToken ?? null, session?.refreshToken ?? null);
  }, [session?.accessToken, session?.refreshToken]);

  return {
    session,
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
