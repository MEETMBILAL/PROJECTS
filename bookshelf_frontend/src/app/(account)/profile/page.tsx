"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ProfilePage() {
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.profile,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile({ full_name: fullName, phone });
      await refetch();
      toast.success("Profile updated");
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary">My Profile</h1>
      <form onSubmit={save} className="card mt-6 max-w-lg space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input className="input bg-surface-alt" value={profile?.email ?? ""} disabled />
        </div>
        <div>
          <label className="label">Username</label>
          <input className="input bg-surface-alt" value={profile?.username ?? ""} disabled />
        </div>
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
