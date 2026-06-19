import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GENRES } from "../src/lib/constants";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Deterministic PRNG so seeds are reproducible.
// ---------------------------------------------------------------------------
let seed = 1337;
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pickMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------------------------------------------------------------------------
// Fictional title generator (original, non-copyrighted sample content).
// ---------------------------------------------------------------------------
const ADJ = [
  "Eternal",
  "Shadow",
  "Crimson",
  "Heavenly",
  "Infinite",
  "Forgotten",
  "Sovereign",
  "Frozen",
  "Astral",
  "Iron",
  "Divine",
  "Hidden",
  "Ascending",
  "Broken",
  "Phantom",
  "Radiant",
  "Abyssal",
  "Solitary",
  "Boundless",
  "Cursed",
];
const NOUN = [
  "Blade Monarch",
  "Tower of Trials",
  "Necromancer's Return",
  "Sword Saint",
  "Demon Hunter",
  "Star Cultivator",
  "Dungeon Architect",
  "Returner",
  "Shield Hero's Heir",
  "Beast Tamer",
  "Alchemist King",
  "Soul Reaper",
  "Academy Genius",
  "Hunter's Ascension",
  "Dragon Emperor",
  "Spirit Realm",
  "Knight of Dawn",
  "Mage Reborn",
  "Guild Master",
  "System Awakening",
];
const SUFFIX = [
  "",
  ": Reborn",
  " Chronicles",
  ": Awakening",
  " Saga",
  ": The Return",
  " Online",
  ": Regression",
  " of the Apocalypse",
  "",
];

const AUTHORS = [
  "Yuna Park",
  "Kenji Sato",
  "Lin Wei",
  "A. Castellano",
  "Mira Novak",
  "Hoseok Jang",
  "Daniel Cho",
  "Ren Takeda",
  "Studio Nightfall",
  "Aria Vance",
];

function makeTitle(i: number): string {
  const base = `${pick(ADJ)} ${pick(NOUN)}${pick(SUFFIX)}`;
  // Guarantee uniqueness with an index-derived flavor when needed.
  return base.length ? base : `Untitled Tale ${i}`;
}

const SYN_TEMPLATES = [
  (t: string) =>
    `After a sudden awakening, the protagonist of ${t} is thrust into a world where strength is everything. Armed with a mysterious power no one else can see, they must climb from the very bottom to challenge the strongest beings alive.`,
  (t: string) =>
    `In ${t}, an ordinary life shatters the day the gates appeared. Monsters poured out, society changed forever, and only the awakened could fight back. Now, one overlooked hunter discovers a secret that could rewrite the balance of power.`,
  (t: string) =>
    `${t} follows a fallen genius given a second chance at life. Carrying memories of a future that ended in catastrophe, they vow to change everything — even if it means defying heaven itself.`,
  (t: string) =>
    `Betrayed and left for dead, the hero of ${t} returns with knowledge of what's to come. This time, they will not make the same mistakes. This time, they will become the apex.`,
];

async function main() {
  console.log("Seeding database…");

  // Clean (order matters for FKs)
  await prisma.chapterPage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.view.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.comicGenre.deleteMany();
  await prisma.comic.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Genres
  const genreRecords = await Promise.all(
    GENRES.map((name) =>
      prisma.genre.create({ data: { name, slug: slugify(name) } }),
    ),
  );
  console.log(`Created ${genreRecords.length} genres`);

  // Users
  const password = await bcrypt.hash("password123", 10);
  const demoUsers = [
    { name: "Demo Reader", email: "demo@asura.test" },
    { name: "Alice", email: "alice@asura.test" },
    { name: "Bob", email: "bob@asura.test" },
  ];
  const users = await Promise.all(
    demoUsers.map((u) =>
      prisma.user.create({ data: { ...u, password, role: "USER" } }),
    ),
  );
  await prisma.user.create({
    data: { name: "Admin", email: "admin@asura.test", password, role: "ADMIN" },
  });
  console.log(`Created ${users.length + 1} users (password: password123)`);

  const statuses: ComicStatus[] = ["ONGOING", "ONGOING", "ONGOING", "COMPLETED", "HIATUS"];
  const types: ComicType[] = ["MANHWA", "MANHWA", "MANGA", "MANHUA"];

  const usedSlugs = new Set<string>();

  for (let i = 0; i < 50; i++) {
    let title = makeTitle(i);
    let slug = slugify(title);
    let dedupe = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(title)}-${dedupe++}`;
    }
    usedSlugs.add(slug);

    const status = pick(statuses);
    const type = pick(types);
    const ratingCount = randInt(20, 5000);
    const avgRating = Math.round((5 + rand() * 5) * 10) / 10; // 5.0 - 10.0
    const totalViews = randInt(5_000, 5_000_000);
    const coverSeed = `${slug}`;
    const releaseYear = randInt(2016, 2025);

    const comic = await prisma.comic.create({
      data: {
        slug,
        title,
        altTitles: [`${title} (Official)`, `${title} Webtoon`],
        coverImage: `https://picsum.photos/seed/${encodeURIComponent(coverSeed)}/400/600`,
        bannerImage: `https://picsum.photos/seed/${encodeURIComponent(coverSeed)}-banner/1280/600`,
        synopsis: pick(SYN_TEMPLATES)(title),
        status,
        type,
        author: pick(AUTHORS),
        artist: pick(AUTHORS),
        releaseYear,
        isFeatured: i < 6,
        totalViews,
        weeklyViews: randInt(500, 200_000),
        monthlyViews: randInt(2_000, 800_000),
        avgRating,
        ratingCount,
        genres: {
          create: pickMany(genreRecords, randInt(3, 5)).map((g) => ({
            genre: { connect: { id: g.id } },
          })),
        },
      },
    });

    // Chapters: 5 - 200
    const chapterCount = randInt(5, 200);
    const now = Date.now();
    const chapterData = [];
    for (let c = 1; c <= chapterCount; c++) {
      // Newer chapters are more recent; chapter `chapterCount` is the latest.
      const daysAgo = (chapterCount - c) * randInt(2, 6);
      chapterData.push({
        comicId: comic.id,
        number: c,
        title: rand() > 0.6 ? `The ${pick(ADJ)} ${pick(["Gate", "Trial", "Awakening", "Duel", "Hunt", "Pact"])}` : null,
        views: randInt(100, 100_000),
        publishedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
      });
    }
    await prisma.chapter.createMany({ data: chapterData });

    // Add pages only to the latest 3 chapters (keeps seed fast; reader works).
    const latestChapters = await prisma.chapter.findMany({
      where: { comicId: comic.id },
      orderBy: { number: "desc" },
      take: 3,
      select: { id: true, number: true },
    });
    for (const ch of latestChapters) {
      const pageCount = randInt(6, 14);
      await prisma.chapterPage.createMany({
        data: Array.from({ length: pageCount }).map((_, p) => ({
          chapterId: ch.id,
          index: p,
          imageUrl: `https://picsum.photos/seed/${slug}-${ch.number}-${p}/800/1200`,
          width: 800,
          height: 1200,
        })),
      });
    }

    // Bookmarks + ratings from demo users for a subset.
    if (i < 12) {
      for (const u of users) {
        if (rand() > 0.5) {
          await prisma.bookmark.create({
            data: {
              userId: u.id,
              comicId: comic.id,
              lastReadChapter: randInt(1, chapterCount),
            },
          });
        }
      }
    }

    if ((i + 1) % 10 === 0) console.log(`  …seeded ${i + 1}/50 comics`);
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
