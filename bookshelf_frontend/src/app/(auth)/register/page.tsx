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
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      await authApi.register(data);
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.success("Account created! Welcome to Bookshelf.pk");
      router.push(ROUTES.home);
      router.refresh();
    } catch {
      toast.error("Registration failed. The email or username may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl text-primary">Create account</h1>
      <p className="mt-1 text-sm text-text-secondary">Join Pakistan&apos;s trusted bookstore</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Field label="Full name" error={errors.full_name?.message}>
          <input className="input-bs" {...register("full_name")} />
        </Field>
        <Field label="Username" error={errors.username?.message}>
          <input className="input-bs" {...register("username")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="input-bs" {...register("email")} />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input className="input-bs" {...register("phone")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" className="input-bs" {...register("password")} />
        </Field>
        <Field label="Confirm password" error={errors.password2?.message}>
          <input type="password" className="input-bs" {...register("password2")} />
        </Field>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="text-secondary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
