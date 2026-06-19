"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("reader@asuraclone.test");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/bookmarks"
    });
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-brand-textSecondary">Sign in to sync bookmarks, ratings, and reading progress.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="grid gap-2 text-sm font-medium text-brand-textSecondary">
          Email
          <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-textSecondary">
          Password
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in with email"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-brand-textMuted">
        <span className="h-px flex-1 bg-brand-surface" />
        OR
        <span className="h-px flex-1 bg-brand-surface" />
      </div>

      <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/bookmarks" })}>
        Continue with Google
      </Button>
    </Card>
  );
}
