import Link from "next/link";
import { getServerSession } from "next-auth";

import { ComicCard } from "@/components/comics/comic-card";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { comics } from "@/lib/mock-data";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  const bookmarked = comics.slice(0, session ? 8 : 0);

  if (!session) {
    return (
      <div className="asura-container flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-white">Bookmarks are for logged-in readers</h1>
        <p className="mt-3 max-w-md text-brand-secondary">Sign in to sync your last-read chapter, latest updates, and unread counts across devices.</p>
        <Button asChild className="mt-6 bg-brand-primary hover:bg-brand-light"><Link href="/api/auth/signin">Login to continue</Link></Button>
      </div>
    );
  }

  return (
    <div className="asura-container py-10">
      <SectionHeading title="Bookmarks" />
      {bookmarked.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {bookmarked.map((comic, index) => <ComicCard key={comic.id} comic={comic} badge={index % 2 === 0 ? "HOT" : undefined} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-surface bg-brand-card p-10 text-center">
          <h2 className="text-xl font-bold text-white">No bookmarks yet</h2>
          <p className="mt-2 text-brand-secondary">Browse the library and add your favorite series.</p>
          <Button asChild className="mt-5 bg-brand-primary hover:bg-brand-light"><Link href="/browse">Browse comics</Link></Button>
        </div>
      )}
    </div>
  );
}
