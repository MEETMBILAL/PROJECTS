import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { searchComics } from "@/lib/search";
import { formatRelativeTime } from "@/lib/utils";

interface SearchResultsProps {
  query: string;
}

export async function SearchResults({ query }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <p className="text-center text-brand-text-secondary py-12">
        Enter a search term to find comics.
      </p>
    );
  }

  let results: Array<{
    id: string;
    slug: string;
    title: string;
    coverImage: string;
    latestChapter?: { number: number; publishedAt: Date };
  }> = [];

  const meiliResults = await searchComics(query);
  if (meiliResults) {
    const comics = await prisma.comic.findMany({
      where: { id: { in: meiliResults.map((r) => r.id) } },
      include: {
        chapters: {
          orderBy: { number: "desc" },
          take: 1,
          select: { number: true, publishedAt: true },
        },
      },
    });
    results = comics.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      coverImage: c.coverImage,
      latestChapter: c.chapters[0]
        ? { number: c.chapters[0].number, publishedAt: c.chapters[0].publishedAt }
        : undefined,
    }));
  } else {
    const comics = await prisma.comic.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { altTitles: { has: query } },
        ],
      },
      take: 20,
      include: {
        chapters: {
          orderBy: { number: "desc" },
          take: 1,
          select: { number: true, publishedAt: true },
        },
      },
    });
    results = comics.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      coverImage: c.coverImage,
      latestChapter: c.chapters[0]
        ? { number: c.chapters[0].number, publishedAt: c.chapters[0].publishedAt }
        : undefined,
    }));
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-brand-text-secondary">No results found for &ldquo;{query}&rdquo;</p>
        <Link href="/browse" className="mt-4 inline-block text-brand-purple-light hover:underline">
          Browse all comics
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {results.map((comic) => (
        <li key={comic.id}>
          <Link
            href={`/comics/${comic.slug}`}
            className="flex items-center gap-4 rounded-lg border border-brand-surface bg-brand-card p-4 transition-colors hover:bg-brand-card-hover"
          >
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-cover">
              <Image src={comic.coverImage} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div>
              <p className="font-medium text-brand-text-primary">{comic.title}</p>
              {comic.latestChapter && (
                <p className="text-sm text-brand-text-secondary">
                  Ch. {comic.latestChapter.number} ·{" "}
                  {formatRelativeTime(comic.latestChapter.publishedAt)}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
