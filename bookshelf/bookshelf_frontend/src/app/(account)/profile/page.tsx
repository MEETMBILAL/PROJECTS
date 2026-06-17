"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { AuthGuard } from "@/components/common/AuthGuard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

function ProfileContent() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.profile,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-text-primary">
        My Profile
      </h1>
      <div className="card max-w-2xl space-y-4 p-6">
        <Row label="Full Name" value={user?.full_name || "—"} />
        <Row label="Username" value={user?.username || "—"} />
        <Row label="Email" value={user?.email || "—"} />
        <Row label="Phone" value={user?.phone || "—"} />
      </div>

      <h2 className="mb-4 mt-8 font-display text-2xl text-text-primary">
        Saved Addresses
      </h2>
      {user?.addresses && user.addresses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {user.addresses.map((addr) => (
            <div key={addr.id} className="card p-4">
              <p className="font-medium text-text-primary">{addr.label}</p>
              <p className="text-sm text-text-secondary">
                {addr.street}, {addr.city}, {addr.province}
              </p>
              <p className="text-sm text-text-muted">{addr.country}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">No saved addresses yet.</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-bordercolor pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
