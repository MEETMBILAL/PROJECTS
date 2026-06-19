import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const GENRES = [
  "Action",
  "Adventure",
  "Fantasy",
  "Romance",
  "Manhwa",
  "System",
  "Regression",
  "Isekai",
  "Comedy",
  "Drama",
  "Horror",
  "Martial Arts",
  "Mystery",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Tragedy",
  "Genius MC",
];

const COMIC_TITLES = [
  "Solo Max-Level Newbie",
  "Nano Machine",
  "Return of the Mount Hua Sect",
  "The Return of the Crazy Demon",
  "Reformation of the Deadbeat Noble",
  "Pick Me Up, Infinite Gacha",
  "Surviving as a Genius on Borrowed Time",
  "Star-Embracing Swordmaster",
  "Overgeared",
  "Infinite Mage",
  "Absolute Regression",
  "The Heavenly Demon Can't Live a Normal Life",
  "Raising Villains the Right Way",
  "Return of the Disaster-Class Hero",
  "The Knight King Who Returned with a God",
  "Logging 10,000 Years into the Future",
  "Solo Farming In The Tower",
  "Academy's Genius Swordmaster",
  "Absolute Sword Sense",
  "Revenge of the Iron-Blooded Sword Hound",
  "The Novel's Extra",
  "The Extra's Academy Survival Guide",
  "Chronicles of the Demon Faction",
  "Barbarian Quest",
  "The Regressed Mercenary's Machinations",
  "The Sword Emperor's Rise of Namgung",
  "Got Dropped into a Ghost Story, Still Gotta Work",
  "Sword God's Livestream",
  "The Divine Demon's Grand Ascension",
  "The Seventh Prince Wants to Bail",
  "The Cold-Blooded Warrior",
  "Bad Born Blood",
  "Rebirth of the Divine Demon",
  "The Demon King Overrun by Heroes",
  "Only I Have an EX-Grade Summon",
  "Kidnapped Dragons",
  "Crimson Reset",
  "Echoes of the Reverse Planet",
  "The Demon God",
  "Terminally-Ill Genius Dark Knight",
  "What a Bountiful Harvest, Demon Lord!",
  "I Killed an Academy Player",
  "The Executioner",
  "Omniscient Reader's Viewpoint",
  "Tower of God: Rebirth",
  "Murim Login",
  "Eleceed",
  "Lookism: New Era",
  "Villain to Kill",
  "The Beginning After the End",
];

const AUTHORS = [
  "Jung Sanim",
  "Han Joong-Wo",
  "Birin",
  "Sleepy-C",
  "Studio Redice",
  "Lee Chang-hwan",
  "TurtleMe",
  "Park Tae-Jun",
];

function coverUrl(seed: number): string {
  return `https://picsum.photos/seed/asura${seed}/300/400`;
}

function pageUrl(seed: number, page: number): string {
  return `https://picsum.photos/seed/asura${seed}p${page}/800/1200`;
}

function randomRating(): number {
  return Math.round((Math.random() * 3 + 7) * 10) / 10;
}

function randomStatus(): ComicStatus {
  const r = Math.random();
  if (r < 0.7) return "ONGOING";
  if (r < 0.9) return "COMPLETED";
  return "HIATUS";
}

function randomType(): ComicType {
  const types: ComicType[] = ["MANGA", "MANHWA", "MANHUA"];
  return types[Math.floor(Math.random() * types.length)];
}

async function main() {
  console.log("Seeding database...");

  await prisma.chapterPage.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.view.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.comicGenre.deleteMany();
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

  const password = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Test User",
        email: "test@asura.com",
        password,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@asura.com",
        password,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    }),
    prisma.user.create({
      data: {
        name: "Reader",
        email: "reader@asura.com",
        password,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  for (let i = 0; i < COMIC_TITLES.length; i++) {
    const title = COMIC_TITLES[i];
    const slug = slugify(title);
    const status = randomStatus();
    const type = randomType();
    const chapterCount = Math.floor(Math.random() * 196) + 5;
    const avgRating = randomRating();
    const numGenres = Math.floor(Math.random() * 3) + 2;
    const shuffledGenres = [...genres].sort(() => Math.random() - 0.5).slice(0, numGenres);

    const comic = await prisma.comic.create({
      data: {
        slug,
        title,
        altTitles: [`${title} (Alt)`],
        coverImage: coverUrl(i),
        synopsis: `${title} follows an extraordinary protagonist in a world filled with danger, mystery, and power. As they navigate through trials and tribulations, they uncover secrets that will change everything. With stunning artwork and gripping storytelling, this series has captivated readers worldwide. Join the adventure as our hero rises from humble beginnings to become a legend.`,
        status,
        type,
        author: AUTHORS[i % AUTHORS.length],
        artist: AUTHORS[(i + 1) % AUTHORS.length],
        releaseYear: 2018 + (i % 7),
        totalViews: Math.floor(Math.random() * 5_000_000) + 100_000,
        avgRating,
        ratingCount: Math.floor(Math.random() * 5000) + 100,
        featured: i < 8,
        genres: {
          create: shuffledGenres.map((g) => ({ genreId: g.id })),
        },
      },
    });

    const now = Date.now();
    for (let ch = 1; ch <= chapterCount; ch++) {
      const daysAgo = (chapterCount - ch) * Math.floor(Math.random() * 3 + 1);
      const publishedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const pageCount = Math.floor(Math.random() * 15) + 5;

      const chapter = await prisma.chapter.create({
        data: {
          comicId: comic.id,
          number: ch,
          title: ch % 10 === 0 ? `Arc ${Math.ceil(ch / 10)} Climax` : null,
          views: Math.floor(Math.random() * 50_000) + 1000,
          publishedAt,
          pages: {
            create: Array.from({ length: pageCount }, (_, p) => ({
              pageNum: p + 1,
              imageUrl: pageUrl(i, ch * 100 + p),
            })),
          },
        },
      });

      if (ch === chapterCount) {
        await prisma.comic.update({
          where: { id: comic.id },
          data: { updatedAt: publishedAt },
        });
      }
    }

    if (i % 10 === 0) console.log(`  Created ${i + 1}/${COMIC_TITLES.length} comics...`);
  }

  await prisma.bookmark.create({
    data: { userId: users[0].id, comicId: (await prisma.comic.findFirst())!.id, lastReadChapter: 50 },
  });

  console.log("Seed completed!");
  console.log("Test accounts: test@asura.com / admin@asura.com / reader@asura.com");
  console.log("Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
