"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { authApi } from "@/lib/api/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      await authApi.requestPasswordReset(values.email);
      setSent(true);
      toast.success("Reset link sent if the account exists");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="card p-8">
      <h1 className="font-display text-2xl text-ink">Reset password</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
          If an account exists for that email, a reset link has been sent.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">Email</span>
            <input type="email" {...register("email")} className="input-bs" />
            {errors.email && (
              <span className="text-xs text-error">{errors.email.message}</span>
            )}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-secondary">
        <Link href={ROUTES.login} className="font-semibold text-primary">
          Back to login
        </Link>
      </p>
    </div>
  );
}
