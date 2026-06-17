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
        full_name: profile.full_name,
        phone: profile.phone,
        username: profile.username,
      });
    }
  }, [profile]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      await refetch();
      toast.success("Profile updated");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink">My Profile</h1>
      <form onSubmit={save} className="card max-w-lg p-6">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              value={profile?.email ?? ""}
              readOnly
              className="input-bs bg-surface-alt"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">Full name</span>
            <input
              value={form.full_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, full_name: event.target.value }))
              }
              className="input-bs"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">Username</span>
            <input
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              className="input-bs"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">Phone</span>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
              className="input-bs"
            />
          </label>
          <button type="submit" disabled={saving} className="btn-primary self-start">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
