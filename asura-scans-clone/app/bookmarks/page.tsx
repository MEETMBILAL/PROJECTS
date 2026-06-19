import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { BookmarkButton } from "@/components/bookmark-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const metadata = {
  title: "Bookmarks"
};

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="container-shell flex min-h-[60vh] items-center justify-center py-12">
        <Card className="max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Sign in to view bookmarks</h1>
          <p className="mt-3 text-sm text-brand-textSecondary">Your bookmarked comics sync across devices after login.</p>
          <Button asChild className="mt-6">
            <Link href="/login">Login to continue</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const prisma = getPrisma();
  const bookmarks = prisma
    ? await prisma.bookmark.findMany({
        where: { userId: session.user.id },
        include: {
          comic: {
            include: {
              genres: { include: { genre: true } },
              chapters: { orderBy: { publishedAt: "desc" }, take: 3 }
            }
          }
        },
        orderBy: { updatedAt: "desc" }
      })
    : [];

  if (!bookmarks.length) {
    return (
      <div className="container-shell py-10">
        <Card className="p-10 text-center">
          <h1 className="text-3xl font-bold text-white">No bookmarks yet</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-textSecondary">
            Browse the catalogue and add series to keep track of unread chapters.
          </p>
          <Button asChild className="mt-6">
            <Link href="/browse">Browse comics</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-shell py-10">
      <h1 className="section-heading mb-6">Bookmarks</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => {
          const comic = bookmark.comic;
          const latest = comic.chapters[0];
          const unread = Math.max((latest?.number ?? 0) - (bookmark.lastReadChapter ?? 0), 0);

          return (
            <Card key={bookmark.id} className="group relative overflow-hidden p-3">
              <Link href={`/comics/${comic.slug}`} className="flex gap-4">
                <Image
                  src={comic.coverImage}
                  alt={`${comic.title} cover`}
                  width={96}
                  height={128}
                  className="aspect-[3/4] rounded-lg object-cover"
                />
                <span className="min-w-0 py-1">
                  <span className="line-clamp-2 font-semibold text-white">{comic.title}</span>
                  <span className="mt-2 block text-sm text-brand-textSecondary">
                    Last read: Ch. {bookmark.lastReadChapter ?? "Not started"}
                  </span>
                  <span className="mt-1 block text-sm text-brand-textSecondary">Latest: Ch. {latest?.number ?? 1}</span>
                  {unread > 0 && (
                    <span className="mt-3 inline-flex rounded-full bg-brand-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                      {unread} unread
                    </span>
                  )}
                </span>
              </Link>
              <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <BookmarkButton comicId={comic.id} initiallyBookmarked />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
