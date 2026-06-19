export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkX } from "lucide-react";
import { RemoveBookmarkButton } from "@/components/comics/RemoveBookmarkButton";

export const metadata = {
  title: "Bookmarks",
};

export default async function BookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin?callbackUrl=/bookmarks");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      comic: {
        include: {
          chapters: {
            orderBy: { number: "desc" },
            take: 1,
            select: { number: true },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <BookmarkX className="h-16 w-16 text-brand-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Bookmarks Yet</h1>
        <p className="text-brand-secondary mb-6">
          Start exploring and bookmark your favorite series!
        </p>
        <Button asChild>
          <Link href="/browse">Browse Comics</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-heading text-2xl mb-8">My Bookmarks</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {bookmarks.map((bookmark) => {
          const latestChapter = bookmark.comic.chapters[0]?.number ?? 0;
          const unread =
            bookmark.lastReadChapter !== null
              ? Math.max(0, latestChapter - bookmark.lastReadChapter)
              : latestChapter;

          return (
            <div key={bookmark.id} className="group relative">
              <Link href={`/comics/${bookmark.comic.slug}`}>
                <div className="relative aspect-cover overflow-hidden rounded-cover">
                  <Image
                    src={bookmark.comic.coverImage}
                    alt={bookmark.comic.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-150"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                  {unread > 0 && (
                    <Badge variant="hot" className="absolute right-2 top-2">
                      {unread} new
                    </Badge>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:text-brand-purple-light transition-colors">
                  {bookmark.comic.title}
                </h3>
                <p className="text-xs text-brand-secondary">
                  {bookmark.lastReadChapter
                    ? `Read: Ch. ${bookmark.lastReadChapter}`
                    : "Not started"}{" "}
                  · Latest: Ch. {latestChapter}
                </p>
              </Link>
              <RemoveBookmarkButton bookmarkId={bookmark.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
