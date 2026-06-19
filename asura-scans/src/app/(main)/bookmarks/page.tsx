import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RatingStars } from "@/components/comics/RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemoveBookmarkButton } from "@/components/comics/RemoveBookmarkButton";

export const metadata = { title: "Bookmarks" };
export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/bookmarks");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      comic: {
        include: {
          chapters: { orderBy: { number: "desc" }, take: 1, select: { number: true } },
        },
      },
      lastChapter: { select: { number: true } },
    },
    orderBy: { updatedAt: "desc" },
  }).catch(() => []);

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">No Bookmarks Yet</h1>
        <p className="text-brand-text-secondary mb-6">
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
      <h1 className="section-heading text-2xl mb-6">My Bookmarks</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {bookmarks.map((bookmark) => {
          const latest = bookmark.comic.chapters[0]?.number ?? 0;
          const lastRead = bookmark.lastChapter?.number ?? 0;
          const unread = Math.max(0, Math.floor(latest - lastRead));

          return (
            <div key={bookmark.id} className="group relative">
              <Link
                href={`/comics/${bookmark.comic.slug}`}
                className="block rounded-cover overflow-hidden bg-brand-card border border-transparent card-hover"
              >
                <div className="relative">
                  <Image
                    src={bookmark.comic.coverImage}
                    alt={bookmark.comic.title}
                    width={300}
                    height={400}
                    className="comic-cover"
                  />
                  {unread > 0 && (
                    <Badge variant="hot" className="absolute top-2 right-2">
                      {unread} new
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-2">
                    {bookmark.comic.title}
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-1">
                    {lastRead > 0 ? `Ch. ${lastRead}` : "Not started"} / Ch. {latest}
                  </p>
                  <RatingStars rating={bookmark.comic.avgRating} size="sm" className="mt-1" />
                </div>
              </Link>
              <RemoveBookmarkButton bookmarkId={bookmark.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
