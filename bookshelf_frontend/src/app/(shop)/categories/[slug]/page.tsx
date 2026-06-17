import { Suspense } from "react";
import type { Metadata } from "next";

import { CategoryBooksClient } from "./CategoryBooksClient";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { serverApi } from "@/lib/api/server";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await serverApi.category(params.slug);
  return {
    title: category?.name ?? "Category",
    description: category?.description || `Books in ${category?.name ?? "this category"}.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const category = await serverApi.category(params.slug);

  return (
    <div className="container-bs py-8">
      <Breadcrumb
        items={[
          { label: "Categories", href: ROUTES.categories },
          { label: category?.name ?? params.slug },
        ]}
      />
      <h1 className="mt-3 text-4xl text-primary">{category?.name ?? "Category"}</h1>
      {category?.description && (
        <p className="mt-2 max-w-2xl text-text-secondary">{category.description}</p>
      )}
      <div className="mt-8">
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryBooksClient slug={params.slug} />
        </Suspense>
      </div>
    </div>
  );
}
