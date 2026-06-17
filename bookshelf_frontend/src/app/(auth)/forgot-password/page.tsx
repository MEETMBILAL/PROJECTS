"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { authApi } from "@/lib/api/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setLoading(true);
    try {
      await authApi.requestPasswordReset(values.email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">Check your email</h1>
        <p className="mt-2 text-sm text-text-secondary">
          If an account exists for that address, we&apos;ve sent a password reset link.
        </p>
        <Link href={ROUTES.login} className="btn-primary mt-6 w-full">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-text-primary">Reset password</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </>
  );
}
