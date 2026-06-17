"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    setSent(true);
    toast.success("If an account exists, a reset link has been sent.");
  };

  return (
    <>
      <h1 className="font-display text-3xl text-text-primary">
        Reset your password
      </h1>
      <p className="mt-2 text-text-secondary">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <div className="mt-8 card p-6 text-sm text-text-secondary">
          Check your inbox for a password reset link. It expires in 1 hour.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Send Reset Link
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-secondary">
        Remembered it?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary">
          Back to login
        </Link>
      </p>
    </>
  );
}
