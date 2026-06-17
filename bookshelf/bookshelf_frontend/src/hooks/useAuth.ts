"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login: (email: string, password: string) =>
      signIn("credentials", { email, password, redirect: false }),
    logout: () => signOut({ callbackUrl: "/" }),
  };
}
