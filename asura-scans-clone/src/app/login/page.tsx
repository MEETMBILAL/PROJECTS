import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="container flex min-h-[calc(100vh-60px)] items-center justify-center py-12">
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
