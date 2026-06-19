import { PrismaClient, ComicStatus, ComicType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const genres = ["Action", "Fantasy", "Romance", "Manhwa", "System", "Regression", "Isekai", "Martial Arts", "Adventure", "Drama", "Comedy", "Supernatural", "Dungeon", "Revenge", "Magic", "School Life"];
const titles = ["Solo Max-Level Newbie", "Return of the Broken Constellation", "The Nebula's Civilisation", "Damn Reincarnation", "Swordmaster's Youngest Son", "Reaper of the Drifting Moon", "The Heavenly Demon Can't Live Normally", "Academy's Genius Swordmaster", "Terminally-Ill Genius Dark Knight", "The Extra's Academy Survival Guide", "Legendary Ranker's Comeback", "Chronicles of the Mystic Scholar", "Dungeon Reset Protocol", "The Regressed Mercenary", "Tower of the Frozen King", "Infinite Mage", "Moonlit Warlock", "Villain to Kill", "Dragon-Devouring Mage", "Player Who Returned 10000 Years Later", "Absolute Sword Sense", "The Novel's Extra Remake", "Priest of Corruption", "Worn and Torn Newbie", "Regressing with the King's Power"];
const coverImages = [
  "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=85",
];
const bannerImages = [
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=1800&q=85",
];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({ where: { email: "reader@example.com" }, update: {}, create: { email: "reader@example.com", name: "Demo Reader", passwordHash, image: "https://placehold.co/128x128/913FE2/ffffff?text=DR" } });
  await prisma.user.upsert({ where: { email: "admin@example.com" }, update: {}, create: { email: "admin@example.com", name: "Asura Admin", passwordHash, role: "ADMIN", image: "https://placehold.co/128x128/111111/ffffff?text=AA" } });

  const genreRecords = await Promise.all(genres.map((name) => prisma.genre.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name) } })));

  for (let index = 0; index < 50; index++) {
    const title = `${titles[index % titles.length]}${index >= titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ""}`;
    const comic = await prisma.comic.upsert({
      where: { slug: slug(title) },
      update: {},
      create: {
        slug: slug(title),
        title,
        altTitles: [`${title} Remastered`, `${title} KR`],
        coverImage: coverImages[index % coverImages.length],
        bannerImage: bannerImages[index % bannerImages.length],
        synopsis: "A relentless hero is pulled into a brutal world of gates, secret clans, and impossible quests. Every chapter raises the stakes with clean action, sharp rivalries, and a premium dark fantasy tone.",
        status: index % 9 === 0 ? ComicStatus.COMPLETED : index % 13 === 0 ? ComicStatus.HIATUS : ComicStatus.ONGOING,
        type: index % 3 === 0 ? ComicType.MANHWA : index % 3 === 1 ? ComicType.MANGA : ComicType.MANHUA,
        author: ["Chugong", "Kim Carnby", "JH", "Sing-Shong", "Ryu Geum-cheol"][index % 5],
        artist: ["Dubu", "Redice Studio", "Sleepy-C", "Mia", "Nangsun"][index % 5],
        releaseYear: 2016 + (index % 9),
        totalViews: 89000 + index * 18317,
        avgRating: Number((7.8 + (index % 17) / 10).toFixed(1)),
        ratingCount: 500 + index * 41,
      },
    });

    const picked = [genreRecords[index % genreRecords.length], genreRecords[(index + 3) % genreRecords.length], genreRecords[(index + 7) % genreRecords.length]];
    await Promise.all(picked.map((genre) => prisma.comicGenre.upsert({ where: { comicId_genreId: { comicId: comic.id, genreId: genre.id } }, update: {}, create: { comicId: comic.id, genreId: genre.id } })));

    const chapterCount = Math.min(200, 5 + ((index * 17) % 196));
    for (let chapterNumber = 1; chapterNumber <= chapterCount; chapterNumber++) {
      const chapter = await prisma.chapter.upsert({
        where: { comicId_number: { comicId: comic.id, number: chapterNumber } },
        update: {},
        create: {
          comicId: comic.id,
          number: chapterNumber,
          title: chapterNumber % 7 === 0 ? "The Ominous Gate" : chapterNumber % 5 === 0 ? "A New Trial" : null,
          views: 2000 + index * 725 + chapterNumber * 311,
          publishedAt: new Date(Date.now() - (chapterCount - chapterNumber + index) * 1000 * 60 * 60 * 12),
        },
      });
      await prisma.chapterPage.createMany({
        data: Array.from({ length: 6 }).map((_, pageIndex) => ({
          chapterId: chapter.id,
          pageNumber: pageIndex + 1,
          imageUrl: `https://placehold.co/900x1400/0f0f0f/ffffff?text=${encodeURIComponent(`Chapter ${chapterNumber} Page ${pageIndex + 1}`)}`,
          width: 900,
          height: 1400,
        })),
        skipDuplicates: true,
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
