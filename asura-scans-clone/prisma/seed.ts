import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ───────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function cover(seed: string, w = 400, h = 533) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function banner(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-banner/1280/720`;
}

function page(seed: string, n: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(`${seed}-p${n}`)}/800/1200`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

// ───────────────────────────────────────────────────────────
// Data — all titles & synopses are original fictional placeholders
// ───────────────────────────────────────────────────────────
const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai",
  "Magic", "Manhwa", "Martial Arts", "Mystery", "Psychological", "Regression",
  "Romance", "School Life", "Sci-Fi", "Seinen", "Shounen", "Slice of Life",
  "Supernatural", "System", "Thriller", "Tower", "Villain",
];

const AUTHORS = [
  "Han Jiwoo", "Seo Minjae", "Kang Taeyang", "Lim Hyejin", "Park Dohyun",
  "Yoon Sera", "Choi Wooseok", "Jung Areum", "Kim Daon", "Oh Sungho",
];

const ARTISTS = [
  "Studio Eclipse", "Inkfall Works", "Aurora Lines", "Crimson Pen Studio",
  "Nightshade Art", "Halcyon Draw", "Violet Frame", "Solaris Ink",
];

// 50 original fictional series titles
const TITLES = [
  "Ascension of the Forgotten Blade",
  "The Tower's Last Climber",
  "Reborn as the Demon King's Tutor",
  "Solo Necromancer",
  "Regression of the Iron Saint",
  "The Villain Wants to Retire",
  "Hunter Academy: Zero Class",
  "My Second Life as a Frost Mage",
  "The Reincarnated Swordmaster",
  "Dungeon Diver Online",
  "The Heavenly Demon Cooks Ramen",
  "Return of the Shadow Monarch's Heir",
  "Max Level Newbie",
  "The Constellation's Reluctant Hero",
  "Apocalypse Gardener",
  "Leveling Up With Lightning",
  "The Duke's Forgotten Daughter",
  "Genius Alchemist of the Fallen Empire",
  "The Last Saint of the Broken Sky",
  "Overpowered Healer in Another World",
  "Steel and Spellfire",
  "The Gamer Who Couldn't Log Out",
  "Throne of the Crimson Dragon",
  "Academy's Weakest Becomes Strongest",
  "The Beast Tamer's Quiet Life",
  "Reaper of the Endless Tower",
  "The Princess Knight's Vow",
  "I Became the Final Boss",
  "Sword God's Disciple",
  "The Time-Looped Assassin",
  "Moonlit Sculptor of Souls",
  "The Returner's Magic Should Be Special",
  "Infinite Mana in the Apocalypse",
  "The Demon Prince Goes to School",
  "Legend of the Northern Blade Bearer",
  "The S-Rank Party's Rejected Healer",
  "Chronicles of the Void Walker",
  "The Greatest Estate Developer's Heir",
  "Omniscient Reader's Apprentice",
  "The Knight King's Second Chance",
  "Surviving the Game as a Barbarian",
  "The Foddergirl's Counterattack",
  "Eternal Contract: Beauty and the Beast",
  "The Cursed Prince and the Witch",
  "Skeleton Soldier Returns",
  "The World After the End of Magic",
  "Pavilion of the Falling Petals",
  "The Frostborn Mercenary",
  "Ranker Who Lives a Second Time",
  "The Final Ascension Path",
];

const SYNOPSIS_TEMPLATES = [
  (t: string) =>
    `When everything was lost, ${"only ashes remained"}. Now, given a single impossible chance, the protagonist of "${t}" must claw their way back from the bottom — armed with knowledge of a future that no one else remembers. Old enemies wait, but this time the rules are different.`,
  (t: string) =>
    `In a world where strength is the only currency, "${t}" follows an outcast who awakens a power thought to be extinct. Hunted by guilds and gods alike, they discover that the system governing this world has a hidden flaw — and they are the only one who can exploit it.`,
  (t: string) =>
    `"${t}" tells the story of a quiet life turned upside down when a mysterious tower appears overnight. With monsters spilling into the streets, an ordinary person rises to become something extraordinary, one floor at a time.`,
  (t: string) =>
    `Betrayed by those they trusted most, the hero of "${t}" returns to the day it all began. Wielding hard-won experience and a heart hardened by loss, they set out to rewrite a destiny that once ended in tragedy.`,
  (t: string) =>
    `Magic is dying, and so is the empire. "${t}" chronicles a brilliant but reckless mage who refuses to accept the end of an era. Through forbidden experiments and unlikely alliances, they search for the spark that could reignite a fading world.`,
];

const COMMENTS = [
  "This chapter went so hard. The art is insane.",
  "Finally the MC gets the recognition he deserves!",
  "I can't believe that cliffhanger, need the next one now.",
  "The world-building in this is top tier.",
  "Anyone else rereading from the start? Hits different.",
  "Best regression manhwa I've read this year.",
  "The villain is actually written really well.",
  "Goosebumps. Every. Single. Time.",
];

async function main() {
  console.log("🌱 Seeding database…");

  // Clean slate (respecting FK order)
  await prisma.comment.deleteMany();
  await prisma.view.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.chapterPage.deleteMany();
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
      prisma.genre.create({ data: { name, slug: slugify(name) } })
    )
  );
  const genreByName = new Map(genreRecords.map((g) => [g.name, g]));
  console.log(`✓ ${genreRecords.length} genres`);

  // Users
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Demo Reader",
        email: "reader@asura.dev",
        password: passwordHash,
        image: cover("reader-avatar", 100, 100),
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@asura.dev",
        password: passwordHash,
        role: "ADMIN",
        image: cover("admin-avatar", 100, 100),
      },
    }),
    prisma.user.create({
      data: {
        name: "ShadowMonarch",
        email: "shadow@asura.dev",
        password: passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "TowerClimber",
        email: "climber@asura.dev",
        password: passwordHash,
      },
    }),
  ]);
  console.log(`✓ ${users.length} users (login: reader@asura.dev / password123)`);

  const statuses: ComicStatus[] = ["ONGOING", "COMPLETED", "HIATUS"];
  const types: ComicType[] = ["MANGA", "MANHWA", "MANHUA"];

  const createdComics: { id: string; chapterIds: string[]; chapterNumbers: number[] }[] = [];

  for (let i = 0; i < TITLES.length; i++) {
    const title = TITLES[i];
    const slug = slugify(title);
    const status =
      i < 6 ? "ONGOING" : i % 9 === 0 ? "HIATUS" : i % 5 === 0 ? "COMPLETED" : rand(statuses);
    const type = rand(types);
    const ratingCount = randInt(20, 5000);
    const avgRating = Number((Math.random() * 3 + 7).toFixed(1)); // 7.0 - 10.0
    const totalViews = randInt(50_000, 5_000_000);
    const chapterCount = randInt(5, 200);

    const seriesGenres = pickN(GENRES, randInt(3, 5));
    if (type === "MANHWA" && !seriesGenres.includes("Manhwa")) seriesGenres.push("Manhwa");

    const synopsis = rand(SYNOPSIS_TEMPLATES)(title);

    const comic = await prisma.comic.create({
      data: {
        slug,
        title,
        altTitles:
          Math.random() > 0.5 ? [`${title} (Official)`, title.split(" ").reverse().join(" ")] : [],
        coverImage: cover(slug),
        bannerImage: banner(slug),
        synopsis,
        status,
        type,
        author: rand(AUTHORS),
        artist: rand(ARTISTS),
        releaseYear: randInt(2016, 2025),
        totalViews,
        weeklyViews: Math.floor(totalViews * (Math.random() * 0.04 + 0.005)),
        monthlyViews: Math.floor(totalViews * (Math.random() * 0.15 + 0.05)),
        avgRating,
        ratingCount,
        featured: i < 5,
        isNew: i % 7 === 0,
        isHot: totalViews > 2_000_000,
        createdAt: daysAgo(randInt(1, 900)),
        genres: {
          create: seriesGenres
            .map((g) => genreByName.get(g))
            .filter((g): g is NonNullable<typeof g> => !!g)
            .map((g) => ({ genreId: g.id })),
        },
      },
    });

    // Chapters
    const chapterIds: string[] = [];
    const chapterNumbers: number[] = [];
    let mostRecent = daysAgo(400);

    for (let c = 1; c <= chapterCount; c++) {
      const publishedAt = daysAgo(Math.max(0, Math.round((chapterCount - c) * 1.5) + randInt(0, 2)));
      if (publishedAt > mostRecent) mostRecent = publishedAt;

      const chapter = await prisma.chapter.create({
        data: {
          comicId: comic.id,
          number: c,
          title: Math.random() > 0.6 ? `The ${rand(["Awakening", "Betrayal", "Ascent", "Reckoning", "Gauntlet", "Covenant", "Eclipse", "Vanguard"])}` : null,
          views: randInt(1000, 200_000),
          publishedAt,
          // Only the latest 5 chapters get full page sets to keep the seed fast.
          pages:
            c > chapterCount - 5
              ? {
                  create: Array.from({ length: randInt(8, 16) }).map((_, p) => ({
                    pageNumber: p + 1,
                    imageUrl: page(slug + "-c" + c, p + 1),
                    width: 800,
                    height: 1200,
                  })),
                }
              : undefined,
        },
      });
      chapterIds.push(chapter.id);
      chapterNumbers.push(c);
    }

    // bump updatedAt to the latest chapter date
    await prisma.comic.update({
      where: { id: comic.id },
      data: { updatedAt: mostRecent },
    });

    createdComics.push({ id: comic.id, chapterIds, chapterNumbers });

    if ((i + 1) % 10 === 0) console.log(`  …${i + 1}/${TITLES.length} comics`);
  }
  console.log(`✓ ${createdComics.length} comics with chapters & pages`);

  // Bookmarks for the demo reader
  const demo = users[0];
  const bookmarkTargets = pickN(createdComics, 8);
  for (const target of bookmarkTargets) {
    const maxCh = Math.max(...target.chapterNumbers);
    await prisma.bookmark.create({
      data: {
        userId: demo.id,
        comicId: target.id,
        lastReadChapter: randInt(1, maxCh),
      },
    });
  }
  console.log(`✓ ${bookmarkTargets.length} bookmarks for demo reader`);

  // Ratings + comments sprinkled across some comics
  for (const target of pickN(createdComics, 20)) {
    for (const user of pickN(users, randInt(1, users.length))) {
      await prisma.rating.upsert({
        where: { userId_comicId: { userId: user.id, comicId: target.id } },
        update: {},
        create: { userId: user.id, comicId: target.id, value: randInt(6, 10) },
      });
    }
    await prisma.comment.create({
      data: {
        userId: rand(users).id,
        comicId: target.id,
        content: rand(COMMENTS),
      },
    });
  }
  console.log("✓ ratings & comments");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
