import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { GENRES, getMockChapterPages, getMockComics } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ── Genres ─────────────────────────────────────────────
  for (const g of GENRES) {
    await prisma.genre.upsert({
      where: { slug: g.slug },
      create: { id: g.id, name: g.name, slug: g.slug },
      update: { name: g.name },
    });
  }
  console.log(`  ✓ ${GENRES.length} genres`);

  // ── Comics + chapters + pages ──────────────────────────
  const comics = getMockComics();
  let chapterTotal = 0;

  for (const comic of comics) {
    const created = await prisma.comic.upsert({
      where: { slug: comic.slug },
      update: {},
      create: {
        slug: comic.slug,
        title: comic.title,
        altTitles: comic.altTitles,
        coverImage: comic.coverImage,
        bannerImage: comic.bannerImage,
        synopsis: comic.synopsis,
        status: comic.status,
        type: comic.type,
        author: comic.author,
        artist: comic.artist,
        releaseYear: comic.releaseYear,
        totalViews: comic.totalViews,
        avgRating: comic.avgRating,
        ratingCount: comic.ratingCount,
        featured: comic.featured,
        isNew: comic.isNew,
        isHot: comic.isHot,
        createdAt: new Date(comic.createdAt),
        updatedAt: new Date(comic.updatedAt),
        genres: {
          create: comic.genres.map((g) => ({
            genre: { connect: { slug: g.slug } },
          })),
        },
      },
    });

    // Only seed pages for the most recent few chapters to keep the seed fast.
    const chaptersToPage = new Set(
      comic.chapters.slice(0, 3).map((c) => c.number)
    );

    for (const ch of comic.chapters) {
      const chapter = await prisma.chapter.create({
        data: {
          comicId: created.id,
          number: ch.number,
          title: ch.title,
          views: ch.views,
          publishedAt: new Date(ch.publishedAt),
        },
      });
      chapterTotal++;

      if (chaptersToPage.has(ch.number)) {
        const pages = getMockChapterPages(comic.slug, ch.number);
        await prisma.chapterPage.createMany({
          data: pages.map((url, index) => ({
            chapterId: chapter.id,
            index,
            imageUrl: url,
          })),
        });
      }
    }
  }
  console.log(`  ✓ ${comics.length} comics, ${chapterTotal} chapters`);

  // ── Sample users ───────────────────────────────────────
  const password = await bcrypt.hash("demo1234", 10);
  const users = [
    { name: "Demo Reader", email: "demo@asura.dev" },
    { name: "Alice Wright", email: "alice@asura.dev" },
    { name: "Bob Carter", email: "bob@asura.dev" },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: password },
    });
  }
  console.log(`  ✓ ${users.length} users (password: demo1234)`);

  // ── Sample bookmarks for the demo user ─────────────────
  const demo = await prisma.user.findUnique({
    where: { email: "demo@asura.dev" },
  });
  if (demo) {
    const some = await prisma.comic.findMany({ take: 5 });
    for (const c of some) {
      await prisma.bookmark.upsert({
        where: { userId_comicId: { userId: demo.id, comicId: c.id } },
        update: {},
        create: { userId: demo.id, comicId: c.id, lastReadChapter: 1 },
      });
    }
    console.log(`  ✓ ${some.length} bookmarks for demo user`);
  }

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
