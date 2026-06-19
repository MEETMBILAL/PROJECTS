import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const GENRES = [
  "Action", "Adventure", "Fantasy", "Romance", "Manhwa", "System",
  "Regression", "Isekai", "Comedy", "Drama", "Martial Arts", "Magic",
  "Reincarnation", "School Life", "Supernatural", "Horror", "Sci-Fi",
  "Slice of Life", "Mystery", "Genius MC", "Sports",
];

const COMICS = [
  { title: "Solo Max-Level Newbie", slug: "solo-max-level-newbie", type: "MANHWA" as const, status: "ONGOING" as const, author: "Maslow", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Nano Machine", slug: "nano-machine", type: "MANHWA" as const, status: "ONGOING" as const, author: "Han-Joong-Welca", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Return of the Mount Hua Sect", slug: "return-of-the-mount-hua-sect", type: "MANHWA" as const, status: "ONGOING" as const, author: "Big Panda", genres: ["Action", "Adventure", "Comedy"] },
  { title: "The Return of the Crazy Demon", slug: "the-return-of-the-crazy-demon", type: "MANHWA" as const, status: "ONGOING" as const, author: "Jangsanbeb", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Pick Me Up, Infinite Gacha", slug: "pick-me-up-infinite-gacha", type: "MANHWA" as const, status: "ONGOING" as const, author: "3B2S Studio", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Reformation of the Deadbeat Noble", slug: "reformation-of-the-deadbeat-noble", type: "MANHWA" as const, status: "ONGOING" as const, author: "Id Tian", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Surviving as a Genius on Borrowed Time", slug: "surviving-as-a-genius-on-borrowed-time", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Genius MC"] },
  { title: "Star-Embracing Swordmaster", slug: "star-embracing-swordmaster", type: "MANHWA" as const, status: "ONGOING" as const, author: "Qinghe Jian", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Overgeared", slug: "overgeared", type: "MANHWA" as const, status: "ONGOING" as const, author: "Park Saenal", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Infinite Mage", slug: "infinite-mage", type: "MANHWA" as const, status: "ONGOING" as const, author: "Sona Chlae", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Absolute Regression", slug: "absolute-regression", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Regression", "Fantasy"] },
  { title: "The Heavenly Demon Can't Live a Normal Life", slug: "the-heavenly-demon-cant-live-a-normal-life", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Return of the Disaster-Class Hero", slug: "return-of-the-disaster-class-hero", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Logging 10,000 Years into the Future", slug: "logging-10000-years-into-the-future", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Solo Farming In The Tower", slug: "solo-farming-in-the-tower", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Academy's Genius Swordmaster", slug: "academys-genius-swordmaster", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Absolute Sword Sense", slug: "absolute-sword-sense", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Revenge of the Iron-Blooded Sword Hound", slug: "revenge-of-the-iron-blooded-sword-hound", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Novel's Extra", slug: "the-novels-extra", type: "MANHWA" as const, status: "COMPLETED" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Extra's Academy Survival Guide", slug: "the-extras-academy-survival-guide", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "School Life"] },
  { title: "Chronicles of the Demon Faction", slug: "chronicles-of-the-demon-faction", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Raising Villains the Right Way", slug: "raising-villains-the-right-way", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Knight King Who Returned with a God", slug: "the-knight-king-who-returned-with-a-god", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Regressed Mercenary's Machinations", slug: "the-regressed-mercenarys-machinations", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Barbarian Quest", slug: "barbarian-quest", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Sword Emperor's Rise of Namgung", slug: "the-sword-emperors-rise-of-namgung", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Martial Arts", "Fantasy"] },
  { title: "Sword God's Livestream", slug: "sword-gods-livestream", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "System"] },
  { title: "The Divine Demon's Grand Ascension", slug: "the-divine-demons-grand-ascension", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Seventh Prince Wants to Bail", slug: "the-seventh-prince-wants-to-bail", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Terminally-Ill Genius Dark Knight", slug: "terminally-ill-genius-dark-knight", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "I Killed an Academy Player", slug: "i-killed-an-academy-player", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "School Life"] },
  { title: "The Executioner", slug: "the-executioner", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Tower of God", slug: "tower-of-god", type: "MANHWA" as const, status: "ONGOING" as const, author: "SIU", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "The Beginning After The End", slug: "the-beginning-after-the-end", type: "MANHWA" as const, status: "ONGOING" as const, author: "TurtleMe", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Omniscient Reader's Viewpoint", slug: "omniscient-readers-viewpoint", type: "MANHWA" as const, status: "COMPLETED" as const, author: "sing N song", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Solo Leveling", slug: "solo-leveling", type: "MANHWA" as const, status: "COMPLETED" as const, author: "Chugong", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Eleceed", slug: "eleceed", type: "MANHWA" as const, status: "ONGOING" as const, author: "Son Jeho", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Lookism", slug: "lookism", type: "MANHWA" as const, status: "ONGOING" as const, author: "Park Tae-joon", genres: ["Action", "Drama", "School Life"] },
  { title: "Wind Breaker", slug: "wind-breaker", type: "MANHWA" as const, status: "ONGOING" as const, author: "Yongseok Jo", genres: ["Action", "School Life", "Sports"] },
  { title: "Viral Hit", slug: "viral-hit", type: "MANHWA" as const, status: "ONGOING" as const, author: "Taejun Pak", genres: ["Action", "Drama", "School Life"] },
  { title: "Mercenary Enrollment", slug: "mercenary-enrollment", type: "MANHWA" as const, status: "ONGOING" as const, author: "Yoon Tae Ho", genres: ["Action", "Adventure", "Drama"] },
  { title: "The Greatest Estate Developer", slug: "the-greatest-estate-developer", type: "MANHWA" as const, status: "ONGOING" as const, author: "Updating", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Martial Peak", slug: "martial-peak", type: "MANHUA" as const, status: "ONGOING" as const, author: "Moments", genres: ["Action", "Martial Arts", "Fantasy"] },
  { title: "Tales of Demons and Gods", slug: "tales-of-demons-and-gods", type: "MANHUA" as const, status: "ONGOING" as const, author: "Mad Snail", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "Soul Land", slug: "soul-land", type: "MANHUA" as const, status: "COMPLETED" as const, author: "Tang Jia San Shao", genres: ["Action", "Adventure", "Fantasy"] },
  { title: "One Piece", slug: "one-piece", type: "MANGA" as const, status: "ONGOING" as const, author: "Eiichiro Oda", genres: ["Action", "Adventure", "Comedy"] },
  { title: "Jujutsu Kaisen", slug: "jujutsu-kaisen", type: "MANGA" as const, status: "COMPLETED" as const, author: "Gege Akutami", genres: ["Action", "Supernatural", "Horror"] },
  { title: "Chainsaw Man", slug: "chainsaw-man", type: "MANGA" as const, status: "ONGOING" as const, author: "Tatsuki Fujimoto", genres: ["Action", "Horror", "Supernatural"] },
  { title: "Blue Lock", slug: "blue-lock", type: "MANGA" as const, status: "ONGOING" as const, author: "Muneyuki Kaneshiro", genres: ["Action", "Sports", "Drama"] },
  { title: "Dandadan", slug: "dandadan", type: "MANGA" as const, status: "ONGOING" as const, author: "Yukinobu Tatsu", genres: ["Action", "Comedy", "Supernatural"] },
  { title: "Sakamoto Days", slug: "sakamoto-days", type: "MANGA" as const, status: "ONGOING" as const, author: "Yuto Suzuki", genres: ["Action", "Comedy", "Mystery"] },
];

function coverUrl(slug: string) {
  return `https://picsum.photos/seed/${slug}/300/400`;
}

function pageUrl(slug: string, ch: number, page: number) {
  return `https://picsum.photos/seed/${slug}-ch${ch}-p${page}/800/1200`;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding database...");

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

  const genreMap = new Map<string, string>();
  for (const name of GENRES) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const genre = await prisma.genre.create({ data: { name, slug } });
    genreMap.set(name, genre.id);
  }

  const password = await bcrypt.hash("password123", 12);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@asura.com",
      name: "Demo User",
      password,
    },
  });

  await prisma.user.create({
    data: {
      email: "reader@asura.com",
      name: "Avid Reader",
      password,
    },
  });

  console.log("Created users: demo@asura.com / password123");

  for (let i = 0; i < COMICS.length; i++) {
    const c = COMICS[i];
    const chapterCount = randomBetween(5, 200);
    const avgRating = Math.round((randomBetween(70, 99) / 10) * 10) / 10;
    const ratingCount = randomBetween(100, 50000);
    const totalViews = randomBetween(10000, 5000000);

    const comic = await prisma.comic.create({
      data: {
        slug: c.slug,
        title: c.title,
        altTitles: [`${c.title} (Alt)`],
        coverImage: coverUrl(c.slug),
        synopsis: `${c.title} follows an extraordinary protagonist in a world filled with danger, mystery, and power. As they navigate through challenges and uncover hidden truths, they must grow stronger to protect what matters most. A thrilling journey of action, adventure, and self-discovery awaits.`,
        status: c.status,
        type: c.type,
        author: c.author,
        artist: c.author,
        releaseYear: randomBetween(2018, 2025),
        totalViews,
        avgRating,
        ratingCount,
        featured: i < 6,
        genres: {
          create: c.genres.map((g) => ({
            genreId: genreMap.get(g) ?? genreMap.get("Action")!,
          })),
        },
      },
    });

    const pagesPerChapter = randomBetween(8, 15);
    const batchSize = 20;

    for (let ch = 1; ch <= chapterCount; ch += batchSize) {
      const end = Math.min(ch + batchSize - 1, chapterCount);
      const chapterData = [];

      for (let n = ch; n <= end; n++) {
        const daysAgo = chapterCount - n;
        chapterData.push({
          comicId: comic.id,
          number: n,
          title: n % 10 === 0 ? `Special Chapter ${n}` : null,
          views: randomBetween(1000, 100000),
          publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - randomBetween(0, 12) * 60 * 60 * 1000),
        });
      }

      for (const chData of chapterData) {
        const chapter = await prisma.chapter.create({ data: chData });
        const pages = Array.from({ length: pagesPerChapter }, (_, p) => ({
          chapterId: chapter.id,
          pageNum: p + 1,
          imageUrl: pageUrl(c.slug, chData.number, p + 1),
        }));
        await prisma.chapterPage.createMany({ data: pages });
      }
    }

    if (i < 5) {
      await prisma.bookmark.create({
        data: { userId: demoUser.id, comicId: comic.id },
      });
    }

    console.log(`  [${i + 1}/${COMICS.length}] ${c.title} (${chapterCount} chapters)`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
