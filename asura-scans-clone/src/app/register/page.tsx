import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
