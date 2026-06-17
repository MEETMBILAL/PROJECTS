"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PODOrderSummary } from "@/components/pod/PODOrderSummary";
import { PODSpecSelector } from "@/components/pod/PODSpecSelector";
import { PODUploader } from "@/components/pod/PODUploader";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { podApi } from "@/lib/api/pod";
import { ApiError } from "@/lib/api/client";

export default function PODPage() {
  const router = useRouter();
  const { status } = useSession();
  const { data: specs, isLoading } = useQuery({
    queryKey: queryKeys.podSpecs(),
    queryFn: podApi.specifications,
  });

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [specId, setSpecId] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(50);
  const [copies, setCopies] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const selectedSpec = specs?.find((s) => s.id === specId) ?? null;

  const submit = async () => {
    if (status !== "authenticated") {
      router.push(`${ROUTES.login}?callbackUrl=${ROUTES.pod}`);
      return;
    }
    if (!title || !specId || !file) {
      toast.error("Please add a title, upload a file and choose a specification.");
      return;
    }
    setSubmitting(true);
    try {
      const signature = (await podApi.uploadSignature()) as Record<string, unknown>;
      const fileUrl =
        (signature.secure_url as string) ||
        `https://files.bookshelf.pk/pod/${encodeURIComponent(file.name)}`;

      const order = await podApi.create({
        specification: specId,
        file_url: fileUrl,
        file_name: file.name,
        page_count: pageCount,
        copies,
        title,
      });
      toast.success("Print order submitted!");
      router.push(ROUTES.podOrders);
      return order;
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Print on Demand" }]} />
      <div className="mt-4 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Print on Demand
        </h1>
        <p className="mt-2 text-text-secondary">
          Upload your manuscript, choose your print specifications, and we&apos;ll deliver a
          professionally bound copy anywhere in Pakistan — no minimum order quantity.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="card p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">1. Document details</h2>
              <label className="label">Document title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input mb-4"
                placeholder="e.g. My Thesis 2026"
              />
              <PODUploader onFileSelected={setFile} />
            </section>

            <section className="card p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">
                2. Choose specification
              </h2>
              <PODSpecSelector
                specs={specs ?? []}
                selectedId={specId}
                onSelect={setSpecId}
              />
            </section>

            <section className="card p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">3. Quantity</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Number of pages</label>
                  <input
                    type="number"
                    min={1}
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, Number(e.target.value)))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Number of copies</label>
                  <input
                    type="number"
                    min={1}
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                    className="input"
                  />
                </div>
              </div>
            </section>
          </div>

          <div>
            <PODOrderSummary spec={selectedSpec} pageCount={pageCount} copies={copies} />
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-primary mt-4 w-full"
            >
              {submitting ? "Submitting…" : "Submit Print Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
