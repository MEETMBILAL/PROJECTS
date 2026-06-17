"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterInput) => {
    setLoading(true);
    try {
      await authApi.register({
        email: values.email,
        username: values.username,
        full_name: values.full_name,
        phone: values.phone,
        password: values.password,
        password2: values.password2,
      });
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      toast.success("Account created!");
      router.push(ROUTES.home);
      router.refresh();
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-text-primary">Create account</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Join Pakistan&apos;s most trusted bookstore
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input" {...register("full_name")} />
          {errors.full_name && (
            <p className="mt-1 text-xs text-error">{errors.full_name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Username</label>
            <input className="input" {...register("username")} />
            {errors.username && (
              <p className="mt-1 text-xs text-error">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input className="input" {...register("phone")} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" {...register("password")} />
            {errors.password && (
              <p className="mt-1 text-xs text-error">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="label">Confirm</label>
            <input type="password" className="input" {...register("password2")} />
            {errors.password2 && (
              <p className="mt-1 text-xs text-error">{errors.password2.message}</p>
            )}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
