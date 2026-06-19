import Link from "next/link";
import { getServerSession } from "next-auth";

import { ComicCard } from "@/components/comic-card";
import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getLatestComics } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Bookmarks",
};

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  const bookmarked = session ? getLatestComics(8) : [];

  if (!session) {
    return (
      <div className="container-shell py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-brand-surface bg-brand-card p-8 text-center">
          <h1 className="text-3xl font-black">Bookmarks require login</h1>
          <p className="mt-3 text-brand-textSecondary">Sign in to save comics, track unread chapters, and resume your last-read chapter.</p>
          <Button asChild className="mt-6">
            <Link href="/api/auth/signin">Login to continue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell space-y-6 py-10">
      <SectionTitle title="Bookmarks" />
      {bookmarked.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {bookmarked.map((comic, index) => (
            <div key={comic.id} className="relative">
              <ComicCard comic={comic} />
              <Badge variant="hot" className="absolute right-3 top-3">
                +{(index % 5) + 1} unread
              </Badge>
              <p className="mt-2 text-xs text-brand-textMuted">
                Last read Ch. {Math.max(1, (comic.chapters[0]?.number ?? 1) - 3)} / Latest Ch. {comic.chapters[0]?.number}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-surface bg-brand-card p-12 text-center">
          <h2 className="text-2xl font-black">No bookmarks yet</h2>
          <p className="mt-2 text-brand-textSecondary">Start browsing and add series to your library.</p>
          <Button asChild className="mt-5">
            <Link href="/browse">Browse comics</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
