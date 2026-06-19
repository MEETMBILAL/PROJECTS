"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/lib/constants";

type Mode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  const [mode, setMode] = React.useState<Mode>("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [googleEnabled, setGoogleEnabled] = React.useState(false);

  React.useEffect(() => {
    getProviders().then((p) => setGoogleEnabled(!!p?.google));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Registration failed.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-brand-surface bg-brand-card p-6 shadow-purple-soft sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-brand-purple text-xl font-extrabold text-white">
          A
        </div>
        <h1 className="text-xl font-bold text-white">
          {mode === "login" ? "Welcome back" : `Join ${SITE.name}`}
        </h1>
        <p className="mt-1 text-sm text-brand-text-secondary">
          {mode === "login"
            ? "Sign in to track your bookmarks and reading progress."
            : "Create an account to bookmark and rate series."}
        </p>
      </div>

      {googleEnabled && (
        <>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-brand-surface" />
            <span className="text-xs text-brand-text-muted">or</span>
            <span className="h-px flex-1 bg-brand-surface" />
          </div>
        </>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ShadowMonarch"
              required
              minLength={2}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-brand-hot/40 bg-brand-hot/10 px-3 py-2 text-sm text-brand-hot"
          >
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-brand-text-secondary">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setError(null);
          }}
          className="font-medium text-brand-purple-light hover:text-brand-purple"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>

      {mode === "login" && (
        <p className="mt-4 rounded-md bg-brand-bg/60 px-3 py-2 text-center text-xs text-brand-text-muted">
          Demo account: <span className="text-brand-text-secondary">reader@asura.dev</span>{" "}
          / <span className="text-brand-text-secondary">password123</span>
        </p>
      )}
    </div>
  );
}
