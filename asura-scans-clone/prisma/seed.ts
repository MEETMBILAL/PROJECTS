import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const genreNames = [
  "Action",
  "Fantasy",
  "Romance",
  "Manhwa",
  "System",
  "Regression",
  "Isekai",
  "Martial Arts",
  "Dungeon",
  "Adventure",
  "Drama",
  "Revenge",
  "Comedy",
  "Supernatural"
];

const titlePrefixes = [
  "Solo",
  "Legendary",
  "Return of the",
  "Heavenly",
  "Academy's",
  "Duke",
  "Demon King's",
  "Omniscient",
  "Nano",
  "Infinite"
];

const titleNouns = [
  "Max-Level Newbie",
  "Broken Constellation",
  "Moonlight Sculptor",
  "Dragon Hunter",
  "Genius Swordsman",
  "Crimson Mage",
  "Regression Warrior",
  "Dungeon Monarch",
  "Villainess",
  "Mount Hua Sect"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cover(index: number) {
  return `https://placehold.co/600x800/1A1A1A/FFFFFF/png?text=Asura+Comic+${index + 1}`;
}

function banner(index: number) {
  return `https://placehold.co/1800x700/111111/913FE2/png?text=Featured+Comic+${index + 1}`;
}

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
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: {
          name,
          slug: slugify(name)
        }
      })
    )
  );

  const passwordHash = await bcrypt.hash("password123", 12);
  const [reader, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Demo Reader",
        email: "reader@asuraclone.test",
        passwordHash
      }
    }),
    prisma.user.create({
      data: {
        name: "Asura Admin",
        email: "admin@asuraclone.test",
        passwordHash,
        role: "ADMIN"
      }
    })
  ]);

  for (let index = 0; index < 50; index += 1) {
    const title = `${titlePrefixes[index % titlePrefixes.length]} ${titleNouns[(index * 3) % titleNouns.length]}`;
    const slug = `${slugify(title)}-${index + 1}`;
    const chapterCount = 5 + ((index * 19) % 196);
    const status = index % 7 === 0 ? ComicStatus.COMPLETED : index % 13 === 0 ? ComicStatus.HIATUS : ComicStatus.ONGOING;
    const type = [ComicType.MANHWA, ComicType.MANGA, ComicType.MANHUA][index % 3];
    const selectedGenres = [genres[index % genres.length], genres[(index + 3) % genres.length], genres[(index + 6) % genres.length]];

    const comic = await prisma.comic.create({
      data: {
        slug,
        title,
        altTitles: [`${title} Remastered`, `${title} Chronicles`],
        coverImage: cover(index),
        bannerImage: banner(index),
        synopsis:
          "A relentless hero claws through towers, noble courts, and monster-infested battlefields while uncovering the truth behind a world rebuilt by quests and fate.",
        status,
        type,
        author: `Author ${index + 1}`,
        artist: `Studio ${index + 1}`,
        releaseYear: 2018 + (index % 8),
        totalViews: 50000 + index * 17500,
        avgRating: Number((7.8 + (index % 20) / 10).toFixed(1)),
        ratingCount: 250 + index * 42,
        genres: {
          create: selectedGenres.map((genre) => ({
            genre: {
              connect: { id: genre.id }
            }
          }))
        }
      }
    });

    for (let chapterNumber = 1; chapterNumber <= chapterCount; chapterNumber += 1) {
      const chapter = await prisma.chapter.create({
        data: {
          comicId: comic.id,
          number: chapterNumber,
          title: chapterNumber % 10 === 0 ? "The Monarch Returns" : `Chapter ${chapterNumber}`,
          views: 1000 + chapterNumber * 331,
          publishedAt: new Date(Date.now() - (chapterCount - chapterNumber) * 86_400_000)
        }
      });

      await prisma.chapterPage.createMany({
        data: Array.from({ length: 6 }, (_, pageIndex) => ({
          chapterId: chapter.id,
          pageIndex: pageIndex + 1,
          imageUrl: `https://placehold.co/800x1200/111111/FFFFFF/png?text=${encodeURIComponent(title)}+Ch+${chapterNumber}+Page+${pageIndex + 1}`,
          width: 800,
          height: 1200
        }))
      });
    }

    if (index < 10) {
      await prisma.bookmark.create({
        data: {
          userId: reader.id,
          comicId: comic.id,
          lastReadChapter: Math.max(1, Math.floor(chapterCount / 2))
        }
      });

      await prisma.rating.create({
        data: {
          userId: admin.id,
          comicId: comic.id,
          value: 8 + (index % 3)
        }
      });
    }
  }

  console.log("Seeded 50 comics, chapters, genres, and demo users.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
