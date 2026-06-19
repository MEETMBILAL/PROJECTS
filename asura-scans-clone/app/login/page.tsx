"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: true,
      callbackUrl: "/bookmarks",
    });
    if (result?.error) setError("Invalid email or password.");
  }

  return (
    <div className="asura-container flex min-h-[80vh] items-center justify-center py-10">
      <Card className="w-full max-w-md border-brand-surface bg-brand-card text-white">
        <CardHeader><CardTitle>Login to Asura Scans</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            <Input name="email" type="email" placeholder="reader@example.com" required className="border-brand-surface bg-brand-background" />
            <Input name="password" type="password" placeholder="Password" required className="border-brand-surface bg-brand-background" />
            {error ? <p className="text-sm text-brand-hot">{error}</p> : null}
            <Button className="bg-brand-primary hover:bg-brand-light">Login</Button>
          </form>
          <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/bookmarks" })} className="mt-4 w-full border-brand-surface text-white hover:bg-brand-hover">
            <Chrome className="mr-2 h-4 w-4" /> Continue with Google
          </Button>
          <p className="mt-4 text-xs text-brand-muted">Seed users use password: password123</p>
        </CardContent>
      </Card>
    </div>
  );
}
