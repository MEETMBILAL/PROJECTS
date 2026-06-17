"use client";

import { useEffect, useState } from "react";
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

export default function PODPage() {
  const router = useRouter();
  const { status } = useSession();
  const { data: specs, isLoading } = useQuery({
    queryKey: queryKeys.podSpecs(),
    queryFn: podApi.specifications,
  });

  const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [copies, setCopies] = useState(1);
  const [totalPrice, setTotalPrice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedSpec = specs?.find((s) => s.id === selectedSpecId) ?? null;

  useEffect(() => {
    if (!selectedSpec || pageCount <= 0) {
      setTotalPrice(null);
      return;
    }
    const pricePerPage = parseFloat(selectedSpec.price_per_page);
    const setupFee = parseFloat(selectedSpec.setup_fee);
    const total = (pricePerPage * pageCount + setupFee) * copies;
    setTotalPrice(total.toFixed(2));
  }, [selectedSpec, pageCount, copies]);

  const canSubmit = Boolean(selectedSpec && file && title && pageCount > 0);

  const submit = async () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to submit a print order.");
      router.push(ROUTES.login);
      return;
    }
    if (!selectedSpec || !file) return;
    setSubmitting(true);
    try {
      // In production the file would be uploaded to Cloudinary using the signed
      // payload from /pod/upload/. Here we request the signature then submit.
      const signature = await podApi.uploadSignature().catch(() => null);
      const fileUrl = signature?.mock
        ? `https://res.cloudinary.com/${signature.cloud_name}/pod/${file.name}`
        : `https://res.cloudinary.com/uploaded/${file.name}`;

      const order = await podApi.createOrder({
        specification: selectedSpec.id,
        file_url: fileUrl,
        file_name: file.name,
        page_count: pageCount,
        copies,
        title,
      });
      toast.success("Print order submitted!");
      router.push(ROUTES.podOrders);
      return order;
    } catch {
      toast.error("Could not submit your print order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-bs py-8">
      <Breadcrumb items={[{ label: "Print on Demand" }]} />
      <div className="mt-3 max-w-2xl">
        <h1 className="text-4xl text-primary">Print on Demand</h1>
        <p className="mt-2 text-text-secondary">
          Upload your manuscript, choose your specifications, and we&apos;ll print and ship
          professional-quality books anywhere in Pakistan.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-8">
            <Step number={1} title="Upload your document">
              <PODUploader
                fileName={file?.name ?? null}
                onFileSelected={setFile}
                onClear={() => setFile(null)}
              />
            </Step>

            <Step number={2} title="Document details">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Book Title"
                    className="input-bs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Page count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={pageCount || ""}
                    onChange={(e) => setPageCount(parseInt(e.target.value, 10) || 0)}
                    className="input-bs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Copies
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={copies}
                    onChange={(e) => setCopies(parseInt(e.target.value, 10) || 1)}
                    className="input-bs"
                  />
                </div>
              </div>
            </Step>

            <Step number={3} title="Choose specifications">
              <PODSpecSelector
                specifications={specs ?? []}
                selectedId={selectedSpecId}
                onSelect={setSelectedSpecId}
              />
            </Step>
          </div>

          <div>
            <PODOrderSummary
              spec={selectedSpec}
              pageCount={pageCount}
              copies={copies}
              totalPrice={totalPrice}
              onSubmit={submit}
              submitting={submitting}
              canSubmit={canSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-surface">
          {number}
        </span>
        <h2 className="text-xl text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}
