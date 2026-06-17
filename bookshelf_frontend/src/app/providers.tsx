"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { AuthTokenSync } from "@/components/common/AuthTokenSync";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthTokenSync />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1C1C1A",
              color: "#FAFAF8",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
