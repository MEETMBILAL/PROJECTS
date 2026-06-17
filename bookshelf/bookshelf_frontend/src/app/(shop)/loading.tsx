import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Loading() {
  return (
    <div className="container-page py-20">
      <LoadingSpinner label="Loading…" />
    </div>
  );
}
