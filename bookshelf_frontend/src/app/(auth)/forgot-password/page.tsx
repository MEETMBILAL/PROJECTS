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

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
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
        <h1 className="text-2xl text-primary">Check your email</h1>
        <p className="mt-2 text-text-secondary">
          If an account exists for that email, we&apos;ve sent a password reset link.
        </p>
        <Link href={ROUTES.login} className="btn-primary mt-6">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl text-primary">Forgot password?</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Email</label>
          <input type="email" className="input-bs" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href={ROUTES.login} className="text-secondary hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
