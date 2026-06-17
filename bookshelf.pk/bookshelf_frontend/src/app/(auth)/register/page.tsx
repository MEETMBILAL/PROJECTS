"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register(values);
      await login(values.email, values.password);
      toast.success("Account created!");
      router.push(ROUTES.home);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="card p-8">
      <h1 className="font-display text-2xl text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Join Pakistan&apos;s most trusted bookstore
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <Field label="Full name" error={errors.full_name?.message}>
          <input {...register("full_name")} className="input-bs" />
        </Field>
        <Field label="Username" error={errors.username?.message}>
          <input {...register("username")} className="input-bs" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className="input-bs" />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input {...register("phone")} className="input-bs" />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" {...register("password")} className="input-bs" />
        </Field>
        <Field
          label="Confirm password"
          error={errors.password_confirm?.message}
        >
          <input
            type="password"
            {...register("password_confirm")}
            className="input-bs"
          />
        </Field>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
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
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-xs text-error">{error}</span>}
    </label>
  );
}
