import { PrismaClient, ComicStatus, ComicType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { GENRES, MOCK_COMICS } from '@/lib/mock-data';
import { slugify } from '@/lib/utils';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.view.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.chapterPage.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.comicGenre.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.comic.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const genreRecords = await Promise.all(
    GENRES.map((name) =>
      prisma.genre.create({
        data: { name, slug: slugify(name) },
      }),
    ),
  );
  const genreByName = new Map(genreRecords.map((genre) => [genre.name, genre]));

  const passwordHash = await bcrypt.hash('password123', 12);
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Demo Reader', email: 'reader@asura.test', passwordHash, image: 'https://i.pravatar.cc/150?img=12' } }),
    prisma.user.create({ data: { name: 'Asura Admin', email: 'admin@asura.test', passwordHash, role: 'ADMIN', image: 'https://i.pravatar.cc/150?img=32' } }),
  ]);

  for (const [index, comic] of MOCK_COMICS.entries()) {
    const chapterCount = Math.min(200, Math.max(5, 5 + ((index * 19) % 196)));
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
        avgRating: comic.avgRating,
        ratingCount: comic.ratingCount,
        genres: {
          create: comic.genres.map((genreName) => ({
            genre: { connect: { id: genreByName.get(genreName)!.id } },
          })),
        },
      },
    });

    for (let chapterNumber = 1; chapterNumber <= chapterCount; chapterNumber += 1) {
      const chapter = await prisma.chapter.create({
        data: {
          comicId: created.id,
          number: chapterNumber,
          title: chapterNumber % 9 === 0 ? `Chapter ${chapterNumber} - The Turning Point` : `Chapter ${chapterNumber}`,
          views: 1000 + chapterNumber * 217 + index * 500,
          publishedAt: new Date(Date.now() - (chapterCount - chapterNumber) * 1000 * 60 * 60 * 12),
        },
      });

      await prisma.chapterPage.createMany({
        data: Array.from({ length: 6 }, (_, pageIndex) => ({
          chapterId: chapter.id,
          pageNumber: pageIndex + 1,
          imageUrl: `https://picsum.photos/seed/${comic.slug}-${chapterNumber}-${pageIndex + 1}/900/1400`,
          width: 900,
          height: 1400,
        })),
      });
    }

    if (index < 12) {
      await prisma.bookmark.create({
        data: {
          userId: users[0].id,
          comicId: created.id,
          lastReadChapter: Math.max(1, Math.floor(chapterCount * 0.7)),
        },
      });
    }
  }

  console.log('Seed complete: 50 comics, realistic chapters, genres, and demo users created.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
