import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify, coverUrl, pageUrl } from "../lib/utils";

const prisma = new PrismaClient();

const GENRES = [
  "Action", "Fantasy", "Romance", "Manhwa", "System", "Regression",
  "Isekai", "Adventure", "Drama", "Comedy", "Horror", "Mystery",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "Martial Arts",
];

const COMIC_TITLES = [
  "Solo Leveling: Ragnarok", "The Beginning After The End", "Omniscient Reader",
  "Tower of God", "Noblesse", "God of Blackfield", "Return of the Mount Hua Sect",
  "Eleceed", "Lookism", "Wind Breaker", "Viral Hit", "Quest Supremacy",
  "Murim Login", "Pick Me Up Infinite Gacha", "Reformation of the Deadbeat Noble",
  "The Greatest Estate Developer", "SSS-Class Suicide Hunter", "Trash of the Count's Family",
  "Overgeared", "Second Life Ranker", "The Legendary Moonlight Sculptor",
  "Dungeon Defense", "The Novel's Extra", "A Returner's Magic Should Be Special",
  "Survival Story of a Sword King", "Kill the Hero", "The Lazy Lord Masters the Sword",
  "Reaper of the Drifting Moon", "Heavenly Demon Instructor", "Return of the Frozen Player",
  "Nano Machine", "Heavenly Inquisition Sword", "The World After the Fall",
  "Player Who Returned 10000 Years Later", "Doom Breaker", "The Dark Mage's Return to Enlistment",
  "Academy's Genius Swordmaster", "The Hero Returns", "Reincarnation of the Suicidal Battle God",
  "My Wife is a Demon Queen", "Magic Emperor", "Spirit Farmer",
  "The Tutorial is Too Hard", "Player", "The Boxer",
  "Weak Hero", "Get Schooled", "Study Group",
  "How to Fight", "Manager Kim", "Mercenary Enrollment",
];

const STATUSES: ComicStatus[] = ["ONGOING", "COMPLETED", "HIATUS"];
const TYPES: ComicType[] = ["MANGA", "MANHWA", "MANHUA"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.chapterPage.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.comicGenre.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.view.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.comic.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const genres = await Promise.all(
    GENRES.map((name) =>
      prisma.genre.create({
        data: { name, slug: slugify(name) },
      })
    )
  );

  const hashedPassword = await bcrypt.hash("password123", 12);

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@asurascans.com",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    },
  });

  await prisma.user.create({
    data: {
      name: "Test Reader",
      email: "reader@asurascans.com",
      password: hashedPassword,
    },
  });

  console.log("✅ Created users");

  for (let i = 0; i < 50; i++) {
    const title = COMIC_TITLES[i] ?? `Manhwa Title ${i + 1}`;
    const slug = slugify(title);
    const status = i < 40 ? "ONGOING" : randomItem(STATUSES);
    const type = i < 35 ? "MANHWA" : randomItem(TYPES);
    const chapterCount = randomInt(5, 200);

    const comic = await prisma.comic.create({
      data: {
        slug,
        title,
        altTitles: [`${title} (Alt)`, `${title} KR`],
        coverImage: coverUrl(slug),
        bannerImage: coverUrl(`${slug}-banner`, 1200, 600),
        synopsis: `In a world where power determines everything, ${title} follows an extraordinary journey of growth, betrayal, and redemption. Our protagonist must overcome impossible odds, forge unlikely alliances, and uncover ancient secrets that could reshape the very fabric of reality. With stunning artwork and heart-pounding action, this series has captivated millions of readers worldwide.`,
        status,
        type,
        author: `Author ${randomInt(1, 20)}`,
        artist: `Artist ${randomInt(1, 20)}`,
        releaseYear: randomInt(2015, 2025),
        totalViews: randomInt(10000, 5000000),
        avgRating: parseFloat((Math.random() * 4 + 6).toFixed(1)),
        ratingCount: randomInt(100, 50000),
        featured: i < 5,
      },
    });

    const genreCount = randomInt(2, 5);
    const selectedGenres = [...genres].sort(() => Math.random() - 0.5).slice(0, genreCount);
    await Promise.all(
      selectedGenres.map((genre) =>
        prisma.comicGenre.create({
          data: { comicId: comic.id, genreId: genre.id },
        })
      )
    );

    const batchSize = 20;
    for (let batch = 0; batch < Math.ceil(chapterCount / batchSize); batch++) {
      const chapters = [];
      const start = batch * batchSize + 1;
      const end = Math.min((batch + 1) * batchSize, chapterCount);

      for (let ch = start; ch <= end; ch++) {
        const daysAgo = (chapterCount - ch) * randomInt(1, 7);
        chapters.push({
          comicId: comic.id,
          number: ch,
          title: ch % 10 === 0 ? `Arc ${Math.ceil(ch / 10)} Climax` : null,
          views: randomInt(1000, 500000),
          publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        });
      }

      await prisma.chapter.createMany({ data: chapters });

      const createdChapters = await prisma.chapter.findMany({
        where: { comicId: comic.id, number: { gte: start, lte: end } },
      });

      for (const chapter of createdChapters) {
        const pageCount = randomInt(8, 15);
        const pages = Array.from({ length: pageCount }, (_, p) => ({
          chapterId: chapter.id,
          pageNum: p + 1,
          imageUrl: pageUrl(`${slug}-ch${chapter.number}-p${p + 1}`),
        }));
        await prisma.chapterPage.createMany({ data: pages });
      }
    }

    if (i % 10 === 0) {
      console.log(`  📚 Created ${i + 1}/50 comics...`);
    }
  }

  const someComics = await prisma.comic.findMany({ take: 10 });
  for (const comic of someComics) {
    await prisma.bookmark.create({
      data: {
        userId: demoUser.id,
        comicId: comic.id,
        lastReadChapter: randomInt(1, 50),
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${GENRES.length} genres`);
  console.log(`   - 50 comics with chapters`);
  console.log(`   - 2 users (demo@asurascans.com / password123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
