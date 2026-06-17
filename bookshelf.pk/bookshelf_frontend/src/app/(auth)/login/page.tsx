"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    const result = await login(values.email, values.password);
    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    router.push(ROUTES.home);
    router.refresh();
  };

  return (
    <div className="card p-8">
      <h1 className="font-display text-2xl text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Log in to continue shopping
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            {...register("email")}
            className="input-bs"
            placeholder="you@example.com"
          />
          {errors.email && (
            <span className="text-xs text-error">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink">Password</span>
          <input type="password" {...register("password")} className="input-bs" />
          {errors.password && (
            <span className="text-xs text-error">
              {errors.password.message}
            </span>
          )}
        </label>

        <Link
          href={ROUTES.forgotPassword}
          className="self-end text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-semibold text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
