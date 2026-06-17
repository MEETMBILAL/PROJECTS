"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginInput } from "@/lib/validations";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || ROUTES.home;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Invalid email or password.");
      return;
    }
    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <>
      <h1 className="text-2xl text-primary">Sign in</h1>
      <p className="mt-1 text-sm text-text-secondary">Welcome back to Bookshelf.pk</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Email</label>
          <input type="email" className="input-bs" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Password</label>
            <Link href={ROUTES.forgotPassword} className="text-xs text-secondary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input type="password" className="input-bs" {...register("password")} />
          {errors.password && (
            <p className="mt-1 text-sm text-error">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="text-secondary hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
