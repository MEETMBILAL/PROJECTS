import { PrismaClient, type ComicStatus, type ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  GENRES,
  MOCK_COMICS,
  getMockChapters,
  getMockPageImages,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

// Cap the number of chapters (with full page sets) seeded per comic to keep the
// seed fast. The no-database mock layer still exposes the full 5–200 range.
const MAX_SEEDED_CHAPTERS = 50;

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean slate ───────────────────────────────────────────────
  console.log("  • clearing existing data");
  await prisma.chapterPage.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.comicGenre.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.view.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.comic.deleteMany();
  await prisma.genre.deleteMany();

  // ── Genres ────────────────────────────────────────────────────
  console.log(`  • creating ${GENRES.length} genres`);
  await prisma.genre.createMany({
    data: GENRES.map((g) => ({ name: g.name, slug: g.slug })),
    skipDuplicates: true,
  });
  const dbGenres = await prisma.genre.findMany();
  const genreIdBySlug = new Map(dbGenres.map((g) => [g.slug, g.id]));

  // Determine featured comics (top 5 by weekly views).
  const featuredSlugs = new Set(
    [...MOCK_COMICS].sort((a, b) => b.weeklyViews - a.weeklyViews).slice(0, 5).map((c) => c.slug),
  );

  // ── Comics + chapters + pages ─────────────────────────────────
  console.log(`  • creating ${MOCK_COMICS.length} comics with chapters`);
  for (const comic of MOCK_COMICS) {
    const created = await prisma.comic.create({
      data: {
        slug: comic.slug,
        title: comic.title,
        altTitles: comic.altTitles,
        coverImage: comic.coverImage,
        bannerImage: comic.bannerImage,
        synopsis: comic.synopsis,
        status: comic.status as ComicStatus,
        type: comic.type as ComicType,
        author: comic.author,
        artist: comic.artist,
        releaseYear: comic.releaseYear,
        totalViews: comic.totalViews,
        weeklyViews: comic.weeklyViews,
        monthlyViews: comic.monthlyViews,
        avgRating: comic.avgRating,
        ratingCount: comic.ratingCount,
        isFeatured: featuredSlugs.has(comic.slug),
        createdAt: new Date(comic.createdAt),
        updatedAt: new Date(comic.updatedAt),
        genres: {
          create: comic.genres
            .map((g) => genreIdBySlug.get(g.slug))
            .filter((id): id is string => Boolean(id))
            .map((genreId) => ({ genreId })),
        },
      },
    });

    const allChapters = getMockChapters(comic.slug); // newest first
    const seededChapters = allChapters.slice(0, MAX_SEEDED_CHAPTERS);

    for (const ch of seededChapters) {
      const chapter = await prisma.chapter.create({
        data: {
          comicId: created.id,
          number: ch.number,
          title: ch.title,
          views: ch.views,
          publishedAt: new Date(ch.publishedAt),
        },
      });
      const pages = getMockPageImages(comic.slug, ch.number);
      await prisma.chapterPage.createMany({
        data: pages.map((p) => ({
          chapterId: chapter.id,
          pageIndex: p.pageIndex,
          imageUrl: p.imageUrl,
          width: p.width,
          height: p.height,
        })),
      });
    }
  }

  // ── Test users ────────────────────────────────────────────────
  console.log("  • creating test users");
  const password = await bcrypt.hash("demo1234", 12);
  await prisma.user.upsert({
    where: { email: "demo@asurascans.com" },
    update: {},
    create: { name: "Demo Reader", email: "demo@asurascans.com", password },
  });
  await prisma.user.upsert({
    where: { email: "admin@asurascans.com" },
    update: {},
    create: { name: "Admin", email: "admin@asurascans.com", password, role: "ADMIN" },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
