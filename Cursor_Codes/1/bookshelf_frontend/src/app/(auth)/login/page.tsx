"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? ROUTES.home;
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const res = await login(data.email, data.password);
    if (res?.error) {
      toast.error("Invalid email or password.");
      return;
    }
    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  };

  return (
    <>
      <h1 className="font-display text-3xl text-text-primary">Welcome back</h1>
      <p className="mt-2 text-text-secondary">
        Log in to continue to your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">
            Email
          </label>
          <input {...register("email")} type="email" className="input" />
          {errors.email ? (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-text-secondary">Password</label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            {...register("password")}
            type="password"
            className="input"
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary">
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
