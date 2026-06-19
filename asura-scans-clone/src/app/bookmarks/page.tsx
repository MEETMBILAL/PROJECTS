import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid";
import { auth } from "@/lib/auth";
import { getUserBookmarks } from "@/lib/bookmarks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookmarks",
};

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/bookmarks");
  }

  const bookmarks = await getUserBookmarks();

  return (
    <div className="container py-8">
      <SectionHeading title="My Bookmarks" />
      <BookmarkGrid initial={bookmarks} />
    </div>
  );
}
