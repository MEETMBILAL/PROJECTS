"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import type { User } from "@/types/user";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = (email: string, password: string) =>
    signIn("credentials", { email, password, redirect: false });

  const logout = () => signOut({ callbackUrl: "/" });

  return {
    user: (session?.user ?? null) as (User & { name?: string }) | null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
  };
}
