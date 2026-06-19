"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-modal border border-brand-surface bg-brand-card p-6">
        {error && (
          <p className="rounded-md bg-brand-badge-hot/20 px-3 py-2 text-sm text-brand-badge-hot" role="alert">
            {error}
          </p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 border-brand-surface bg-brand-dark"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 border-brand-surface bg-brand-dark"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-purple hover:bg-brand-purple-light"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-surface" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-brand-card px-2 text-brand-muted">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-brand-surface"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Continue with Google
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-brand-text-secondary">
        Demo: demo@asurascans.com / password123
      </p>
    </>
  );
}
