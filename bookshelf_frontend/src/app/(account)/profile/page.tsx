"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { authApi } from "@/lib/api/auth";

export default function ProfilePage() {
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.profile,
  });

  const [form, setForm] = useState({ full_name: "", phone: "", username: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        username: profile.username ?? "",
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      toast.success("Profile updated");
      refetch();
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl text-primary">My Profile</h1>
      <form onSubmit={save} className="card-bs mt-6 flex max-w-lg flex-col gap-4 p-6">
        <Field label="Email">
          <input className="input-bs bg-surface-alt" value={profile?.email ?? ""} disabled />
        </Field>
        <Field label="Username">
          <input
            className="input-bs"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </Field>
        <Field label="Full name">
          <input
            className="input-bs"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <input
            className="input-bs"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <button type="submit" disabled={saving} className="btn-primary self-start disabled:opacity-40">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>
      {children}
    </div>
  );
}
