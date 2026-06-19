import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <SectionHeading title="Sign In" className="border-l-0 pl-0 text-center" />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-modal bg-brand-card" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
