"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PODOrderSummary } from "@/components/pod/PODOrderSummary";
import { PODSpecSelector } from "@/components/pod/PODSpecSelector";
import { PODUploader, type UploadedFile } from "@/components/pod/PODUploader";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/constants/queryKeys";
import { podApi } from "@/lib/api/pod";
import { useDebounce } from "@/hooks/useDebounce";

export default function PODPage() {
  const router = useRouter();
  const { status } = useSession();
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [title, setTitle] = useState("");
  const [specId, setSpecId] = useState<number | null>(null);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const debouncedPages = useDebounce(pages, 400);
  const debouncedCopies = useDebounce(copies, 400);

  const { data: specs, isLoading } = useQuery({
    queryKey: queryKeys.podSpecs(),
    queryFn: podApi.specifications,
  });

  useEffect(() => {
    if (file) {
      setPages(file.pageEstimate);
      if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (!specId || debouncedPages < 1) {
      setTotal(null);
      return;
    }
    let active = true;
    setCalculating(true);
    podApi
      .calculate(specId, debouncedPages, debouncedCopies)
      .then((result) => {
        if (active) setTotal(parseFloat(result.total_price));
      })
      .catch(() => active && setTotal(null))
      .finally(() => active && setCalculating(false));
    return () => {
      active = false;
    };
  }, [specId, debouncedPages, debouncedCopies]);

  const submit = async () => {
    if (status !== "authenticated") {
      toast.error("Please log in to place a print order");
      router.push(ROUTES.login);
      return;
    }
    if (!file || !specId) return;
    setSubmitting(true);
    try {
      const order = await podApi.createOrder({
        specification: specId,
        title,
        page_count: pages,
        copies,
        file_url: file.url.startsWith("blob:")
          ? "https://example.com/pod/" + encodeURIComponent(file.name)
          : file.url,
        file_name: file.name,
      });
      toast.success(`Print order ${order.pod_number} submitted!`);
      router.push(ROUTES.podOrders);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Print on Demand" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl text-ink">Print on Demand</h1>
        <p className="mt-2 text-ink-secondary">
          Upload a PDF, choose your print specifications, and we&apos;ll print
          and deliver your custom book or document anywhere in Pakistan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <SectionHeader title="1. Upload your file" />
            <PODUploader onFileReady={setFile} />
          </section>

          <section>
            <SectionHeader title="2. Document details" />
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 sm:col-span-3">
                <span className="text-sm font-medium text-ink">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="input-bs"
                  placeholder="My document title"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-ink">Pages</span>
                <input
                  type="number"
                  min={1}
                  value={pages}
                  onChange={(event) =>
                    setPages(Math.max(1, Number(event.target.value)))
                  }
                  className="input-bs"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-ink">Copies</span>
                <input
                  type="number"
                  min={1}
                  value={copies}
                  onChange={(event) =>
                    setCopies(Math.max(1, Number(event.target.value)))
                  }
                  className="input-bs"
                />
              </label>
            </div>
          </section>

          <section>
            <SectionHeader title="3. Choose specification" />
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <PODSpecSelector
                specs={specs ?? []}
                selectedId={specId}
                onSelect={setSpecId}
              />
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PODOrderSummary
            pages={pages}
            copies={copies}
            total={total}
            isCalculating={calculating}
            onSubmit={submit}
            canSubmit={Boolean(file && specId && title)}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
