import { PrismaClient, type ComicStatus, type ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { allGenres, comics } from "../lib/mock-data";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    [
      { name: "Ari Reader", email: "reader@asuraclone.dev" },
      { name: "Mina Scanlator", email: "scanlator@asuraclone.dev" },
      { name: "Jun Admin", email: "admin@asuraclone.dev" },
    ].map(async (user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          passwordHash: await bcrypt.hash("asura1234", 12),
          image: `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`,
        },
      }),
    ),
  );

  const genreRecords = await Promise.all(
    allGenres.map((name) =>
      prisma.genre.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) },
      }),
    ),
  );

  const genreByName = new Map(genreRecords.map((genre) => [genre.name, genre]));

  for (const comic of comics) {
    const createdComic = await prisma.comic.upsert({
      where: { slug: comic.slug },
      update: {
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
        avgRating: comic.avgRating,
        ratingCount: comic.ratingCount,
      },
      create: {
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
        avgRating: comic.avgRating,
        ratingCount: comic.ratingCount,
      },
    });

    await prisma.comicGenre.deleteMany({ where: { comicId: createdComic.id } });
    await prisma.comicGenre.createMany({
      data: comic.genres
        .map((genreName) => genreByName.get(genreName))
        .filter(Boolean)
        .map((genre) => ({ comicId: createdComic.id, genreId: genre!.id })),
      skipDuplicates: true,
    });

    for (const chapter of comic.chapters) {
      const createdChapter = await prisma.chapter.upsert({
        where: {
          comicId_number: {
            comicId: createdComic.id,
            number: chapter.number,
          },
        },
        update: {
          title: chapter.title,
          views: chapter.views,
          publishedAt: new Date(chapter.publishedAt),
        },
        create: {
          comicId: createdComic.id,
          number: chapter.number,
          title: chapter.title,
          views: chapter.views,
          publishedAt: new Date(chapter.publishedAt),
        },
      });

      await prisma.chapterPage.deleteMany({ where: { chapterId: createdChapter.id } });
      await prisma.chapterPage.createMany({
        data: chapter.pages.map((page) => ({
          chapterId: createdChapter.id,
          pageNumber: page.pageNumber,
          imageUrl: page.imageUrl,
          width: page.width,
          height: page.height,
        })),
      });
    }
  }

  await prisma.bookmark.upsert({
    where: {
      userId_comicId: {
        userId: users[0].id,
        comicId: (await prisma.comic.findUniqueOrThrow({ where: { slug: comics[0].slug } })).id,
      },
    },
    update: { lastReadChapter: 8 },
    create: {
      userId: users[0].id,
      comicId: (await prisma.comic.findUniqueOrThrow({ where: { slug: comics[0].slug } })).id,
      lastReadChapter: 8,
    },
  });

  console.log(`Seeded ${comics.length} comics, ${allGenres.length} genres, and ${users.length} users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
