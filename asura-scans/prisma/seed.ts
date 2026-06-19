import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const GENRES = [
  "Action", "Adventure", "Fantasy", "Romance", "Manhwa", "System",
  "Regression", "Isekai", "Comedy", "Drama", "Horror", "Mystery",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
  "Genius MC", "Martial Arts", "Magic",
];

const COMICS = [
  { title: "Solo Max-Level Newbie", author: "Swing Bat", type: "MANHWA" as ComicType, status: "ONGOING" as ComicStatus },
  { title: "Nano Machine", author: "Han-Joong-Welca", type: "MANHWA", status: "ONGOING" },
  { title: "Return of the Mount Hua Sect", author: "Big Panda", type: "MANHWA", status: "ONGOING" },
  { title: "The Return of the Crazy Demon", author: "Jaehyun", type: "MANHWA", status: "ONGOING" },
  { title: "Pick Me Up, Infinite Gacha", author: "Redice Studio", type: "MANHWA", status: "ONGOING" },
  { title: "Overgeared", author: "Park Saenal", type: "MANHWA", status: "ONGOING" },
  { title: "Reformation of the Deadbeat Noble", author: "Iden", type: "MANHWA", status: "ONGOING" },
  { title: "Surviving as a Genius on Borrowed Time", author: "Sadoyeon", type: "MANHWA", status: "ONGOING" },
  { title: "Star-Embracing Swordmaster", author: "Qing Koi", type: "MANHWA", status: "ONGOING" },
  { title: "The Extra's Academy Survival Guide", author: "Studio Plot", type: "MANHWA", status: "ONGOING" },
  { title: "Absolute Regression", author: "S-Cynic", type: "MANHWA", status: "ONGOING" },
  { title: "Infinite Mage", author: "S-Cynic", type: "MANHWA", status: "ONGOING" },
  { title: "Logging 10,000 Years into the Future", author: "Xiao Nuo", type: "MANHUA", status: "ONGOING" },
  { title: "Solo Farming In The Tower", author: "S-Cynic", type: "MANHWA", status: "ONGOING" },
  { title: "The Heavenly Demon Can't Live a Normal Life", author: "Great H", type: "MANHWA", status: "ONGOING" },
  { title: "Return of the Disaster-Class Hero", author: "BGman", type: "MANHWA", status: "ONGOING" },
  { title: "The Knight King Who Returned with a God", author: "Studio D", type: "MANHWA", status: "ONGOING" },
  { title: "Raising Villains the Right Way", author: "Studio Plot", type: "MANHWA", status: "ONGOING" },
  { title: "Academy's Genius Swordmaster", author: "Studio A", type: "MANHWA", status: "ONGOING" },
  { title: "Absolute Sword Sense", author: "Studio B", type: "MANHWA", status: "ONGOING" },
  { title: "Revenge of the Iron-Blooded Sword Hound", author: "Studio C", type: "MANHWA", status: "ONGOING" },
  { title: "The Novel's Extra", author: "Studio D", type: "MANHWA", status: "COMPLETED" },
  { title: "Barbarian Quest", author: "Studio E", type: "MANHWA", status: "COMPLETED" },
  { title: "Sword God's Livestream", author: "Studio F", type: "MANHWA", status: "ONGOING" },
  { title: "The Divine Demon's Grand Ascension", author: "Studio G", type: "MANHWA", status: "ONGOING" },
  { title: "The Seventh Prince Wants to Bail", author: "Studio H", type: "MANHWA", status: "ONGOING" },
  { title: "The Regressed Mercenary's Machinations", author: "Studio I", type: "MANHWA", status: "ONGOING" },
  { title: "Chronicles of the Demon Faction", author: "Studio J", type: "MANHWA", status: "ONGOING" },
  { title: "The Sword Emperor's Rise of Namgung", author: "Studio K", type: "MANHWA", status: "ONGOING" },
  { title: "Got Dropped into a Ghost Story, Still Gotta Work", author: "Studio L", type: "MANHWA", status: "ONGOING" },
  { title: "The Cold-Blooded Warrior", author: "Studio M", type: "MANHWA", status: "ONGOING" },
  { title: "Bad Born Blood", author: "Studio N", type: "MANHWA", status: "ONGOING" },
  { title: "Rebirth of the Divine Demon", author: "Studio O", type: "MANHWA", status: "ONGOING" },
  { title: "The Demon King Overrun by Heroes", author: "Studio P", type: "MANHWA", status: "ONGOING" },
  { title: "Only I Have an EX-Grade Summon", author: "Studio Q", type: "MANHWA", status: "ONGOING" },
  { title: "Kidnapped Dragons", author: "Studio R", type: "MANHWA", status: "ONGOING" },
  { title: "Crimson Reset", author: "Studio S", type: "MANHWA", status: "ONGOING" },
  { title: "Echoes of the Reverse Planet", author: "Studio T", type: "MANHWA", status: "ONGOING" },
  { title: "The Demon God", author: "Studio U", type: "MANHWA", status: "ONGOING" },
  { title: "Terminally-Ill Genius Dark Knight", author: "Studio V", type: "MANHWA", status: "ONGOING" },
  { title: "What a Bountiful Harvest, Demon Lord!", author: "Studio W", type: "MANHWA", status: "ONGOING" },
  { title: "I Killed an Academy Player", author: "Studio X", type: "MANHWA", status: "ONGOING" },
  { title: "The Executioner", author: "Studio Y", type: "MANHWA", status: "ONGOING" },
  { title: "One Piece", author: "Eiichiro Oda", type: "MANGA", status: "ONGOING" },
  { title: "Tower of God", author: "SIU", type: "MANHWA", status: "HIATUS" },
  { title: "The Beginning After The End", author: "TurtleMe", type: "MANHWA", status: "ONGOING" },
  { title: "Omniscient Reader's Viewpoint", author: "Sing N Song", type: "MANHWA", status: "COMPLETED" },
  { title: "Solo Leveling", author: "Chugong", type: "MANHWA", status: "COMPLETED" },
  { title: "Eleceed", author: "Son Je-Ho", type: "MANHWA", status: "ONGOING" },
  { title: "Lookism", author: "Park Tae-joon", type: "MANHWA", status: "ONGOING" },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRating(): number {
  return Math.round((7 + Math.random() * 2.8) * 10) / 10;
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

  const password = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.create({
      data: { name: "Test User", email: "test@asura.com", password },
    }),
    prisma.user.create({
      data: { name: "Admin", email: "admin@asura.com", password },
    }),
    prisma.user.create({
      data: { name: "Reader", email: "reader@asura.com", password },
    }),
  ]);

  console.log(`✅ Created ${genres.length} genres and ${users.length} users`);

  for (let i = 0; i < COMICS.length; i++) {
    const comicData = COMICS[i];
    const slug = slugify(comicData.title);
    const chapterCount = randomBetween(5, 200);
    const avgRating = randomRating();
    const isNew = i < 12;
    const featured = i < 5;

    const comic = await prisma.comic.create({
      data: {
        slug,
        title: comicData.title,
        altTitles: [`${comicData.title} (Alt)`],
        coverImage: `https://picsum.photos/seed/${slug}/300/400`,
        synopsis: `In a world where power determines everything, ${comicData.title} follows an extraordinary journey of growth, betrayal, and redemption. Our protagonist must navigate treacherous paths, forge unlikely alliances, and uncover ancient secrets that could change the fate of the entire realm. With stunning artwork and gripping storytelling, this series has captivated millions of readers worldwide.`,
        status: comicData.status,
        type: comicData.type,
        author: comicData.author,
        artist: comicData.author,
        releaseYear: randomBetween(2018, 2025),
        totalViews: randomBetween(10000, 5000000),
        avgRating,
        ratingCount: randomBetween(100, 50000),
        featured,
        isNew,
        genres: {
          create: Array.from(
            new Set(
              Array.from({ length: randomBetween(2, 4) }, () =>
                genres[randomBetween(0, genres.length - 1)].id
              )
            )
          ).map((genreId) => ({ genreId })),
        },
      },
    });

    const chapters = [];
    for (let ch = 1; ch <= chapterCount; ch++) {
      const daysAgo = randomBetween(0, 365);
      const publishedAt = new Date();
      publishedAt.setDate(publishedAt.getDate() - daysAgo);

      const chapter = await prisma.chapter.create({
        data: {
          comicId: comic.id,
          number: ch,
          title: ch % 10 === 0 ? `Arc ${Math.ceil(ch / 10)} - Part ${ch % 10 || 10}` : null,
          views: randomBetween(1000, 500000),
          publishedAt,
          pages: {
            create: Array.from({ length: randomBetween(8, 20) }, (_, p) => ({
              pageNum: p + 1,
              imageUrl: `https://picsum.photos/seed/${slug}-ch${ch}-p${p + 1}/800/1200`,
            })),
          },
        },
      });
      chapters.push(chapter);
    }

    for (let v = 0; v < randomBetween(50, 200); v++) {
      const daysAgo = randomBetween(0, 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      await prisma.view.create({
        data: {
          comicId: comic.id,
          chapterId: chapters[randomBetween(0, chapters.length - 1)].id,
          userId: Math.random() > 0.5 ? users[randomBetween(0, users.length - 1)].id : null,
          createdAt,
        },
      });
    }

    if (i < 5) {
      await prisma.bookmark.create({
        data: {
          userId: users[0].id,
          comicId: comic.id,
          lastReadChapter: randomBetween(1, Math.min(50, chapterCount)),
        },
      });
    }

    console.log(`  📚 ${comic.title} (${chapterCount} chapters)`);
  }

  console.log("\n🎉 Seed completed!");
  console.log("Test accounts: test@asura.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
