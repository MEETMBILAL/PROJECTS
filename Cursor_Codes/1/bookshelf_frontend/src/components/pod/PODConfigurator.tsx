"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { podApi } from "@/lib/api/pod";
import { queryKeys } from "@/constants/queryKeys";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export function PODConfigurator() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: specs, isLoading } = useQuery({
    queryKey: queryKeys.podSpecs,
    queryFn: podApi.specifications,
  });

  const [specId, setSpecId] = useState<number | null>(null);
  const [pages, setPages] = useState(50);
  const [copies, setCopies] = useState(1);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (specs && specs.length > 0 && specId === null) {
      setSpecId(specs[0].id);
    }
  }, [specs, specId]);

  const selectedSpec = useMemo(
    () => specs?.find((s) => s.id === specId),
    [specs, specId],
  );

  const total = useMemo(() => {
    if (!selectedSpec) return 0;
    const perCopy =
      parseFloat(selectedSpec.setup_fee) +
      parseFloat(selectedSpec.price_per_page) * pages;
    return perCopy * copies;
  }, [selectedSpec, pages, copies]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to place a POD order.");
      router.push(`${ROUTES.login}?redirect=${ROUTES.pod}`);
      return;
    }
    if (!selectedSpec || !title) {
      toast.error("Please add a title and choose a specification.");
      return;
    }
    setSubmitting(true);
    try {
      const order = await podApi.createOrder({
        specification: selectedSpec.id,
        page_count: pages,
        copies,
        title,
        file_name: fileName || "document.pdf",
        file_url: "https://example.com/uploads/document.pdf",
      });
      toast.success(`POD order created: ${order.title}`);
      router.push(ROUTES.podOrders);
    } catch (err) {
      toast.error((err as Error).message || "Could not create POD order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="card p-6">
          <h3 className="mb-4 font-display text-lg text-text-primary">
            1. Upload your document
          </h3>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-bordercolor bg-surface-alt/50 px-6 py-10 text-center transition-colors hover:border-primary">
            <FileUp className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {fileName || "Click to upload a PDF"}
            </span>
            <span className="text-xs text-text-muted">
              Max 100MB · PDF only
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
                }
              }}
            />
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            className="input mt-4"
          />
        </section>

        <section className="card p-6">
          <h3 className="mb-4 font-display text-lg text-text-primary">
            2. Choose specifications
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {specs?.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSpecId(spec.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  specId === spec.id
                    ? "border-primary bg-accent"
                    : "border-bordercolor hover:border-primary"
                }`}
              >
                <p className="font-medium text-text-primary">{spec.name}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {spec.paper_size} · {spec.color_mode} · {spec.binding}
                </p>
                <p className="mt-2 text-sm text-primary">
                  {formatPrice(spec.price_per_page)} / page
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h3 className="mb-4 font-display text-lg text-text-primary">
            3. Quantity
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm text-text-secondary">
                Number of pages
              </span>
              <input
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(Math.max(1, Number(e.target.value)))}
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-text-secondary">
                Copies
              </span>
              <input
                type="number"
                min={1}
                value={copies}
                onChange={(e) =>
                  setCopies(Math.max(1, Number(e.target.value)))
                }
                className="input"
              />
            </label>
          </div>
        </section>
      </div>

      <div className="card h-fit space-y-4 p-6">
        <h3 className="font-display text-xl text-text-primary">
          Price Estimate
        </h3>
        {selectedSpec ? (
          <div className="space-y-2 text-sm">
            <Row label="Specification" value={selectedSpec.name} />
            <Row label="Setup fee" value={formatPrice(selectedSpec.setup_fee)} />
            <Row
              label="Per page"
              value={formatPrice(selectedSpec.price_per_page)}
            />
            <Row label="Pages" value={String(pages)} />
            <Row label="Copies" value={String(copies)} />
          </div>
        ) : null}
        <div className="flex justify-between border-t border-bordercolor pt-4">
          <span className="font-medium text-text-primary">Total</span>
          <span className="font-display text-2xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? "Submitting…" : "Place POD Order"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}
