"use client";

import type { UseFormReturn } from "react-hook-form";

import { PROVINCES, type CheckoutInput } from "@/lib/validations";

export function AddressForm({ form }: { form: UseFormReturn<CheckoutInput> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.address?.full_name?.message}>
        <input className="input-bs" {...register("address.full_name")} />
      </Field>
      <Field label="Phone" error={errors.address?.phone?.message}>
        <input className="input-bs" {...register("address.phone")} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Street address" error={errors.address?.street?.message}>
          <input className="input-bs" {...register("address.street")} />
        </Field>
      </div>
      <Field label="City" error={errors.address?.city?.message}>
        <input className="input-bs" {...register("address.city")} />
      </Field>
      <Field label="Province" error={errors.address?.province?.message}>
        <select className="input-bs" {...register("address.province")}>
          <option value="">Select province</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Postal code (optional)" error={errors.address?.postal_code?.message}>
        <input className="input-bs" {...register("address.postal_code")} />
      </Field>
      <Field label="Country" error={errors.address?.country?.message}>
        <input className="input-bs" defaultValue="Pakistan" {...register("address.country")} />
      </Field>
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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
