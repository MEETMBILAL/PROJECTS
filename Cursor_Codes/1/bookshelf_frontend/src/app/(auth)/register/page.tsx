"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { authApi } from "@/lib/api/auth";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await authApi.register(data);
      toast.success("Account created!");
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.push(ROUTES.home);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || "Registration failed.");
    }
  };

  return (
    <>
      <h1 className="font-display text-3xl text-text-primary">
        Create your account
      </h1>
      <p className="mt-2 text-text-secondary">
        Join Bookshelf.pk and start reading.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Field label="Full Name" error={errors.full_name?.message}>
          <input {...register("full_name")} className="input" />
        </Field>
        <Field label="Username" error={errors.username?.message}>
          <input {...register("username")} className="input" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" />
        </Field>
        <Field label="Phone (optional)">
          <input {...register("phone")} className="input" />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input {...register("password")} type="password" className="input" />
        </Field>
        <Field label="Confirm Password" error={errors.password2?.message}>
          <input
            {...register("password2")}
            type="password"
            className="input"
          />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary">
          Log in
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
    <label className="block">
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-error">{error}</span>
      ) : null}
    </label>
  );
}
