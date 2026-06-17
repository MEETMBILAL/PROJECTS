"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";

import { PAKISTAN_PROVINCES } from "@/constants/config";
import type { AddressInput } from "@/lib/validations";

interface AddressFormProps {
  register: UseFormRegister<AddressInput>;
  errors: FieldErrors<AddressInput>;
}

export function AddressForm({ register, errors }: AddressFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.recipient_name?.message}>
        <input {...register("recipient_name")} className="input-bs" />
      </Field>
      <Field label="Phone" error={errors.recipient_phone?.message}>
        <input {...register("recipient_phone")} className="input-bs" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Street address" error={errors.street?.message}>
          <input {...register("street")} className="input-bs" />
        </Field>
      </div>
      <Field label="City" error={errors.city?.message}>
        <input {...register("city")} className="input-bs" />
      </Field>
      <Field label="Province" error={errors.province?.message}>
        <select {...register("province")} className="input-bs">
          <option value="">Select province</option>
          {PAKISTAN_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Postal code (optional)" error={errors.postal_code?.message}>
        <input {...register("postal_code")} className="input-bs" />
      </Field>
      <Field label="Country" error={errors.country?.message}>
        <input
          {...register("country")}
          defaultValue="Pakistan"
          className="input-bs"
          readOnly
        />
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
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-xs text-error">{error}</span>}
    </label>
  );
}
