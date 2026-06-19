import { ComicCard } from '@/components/comics/comic-card';
import { SectionHeading } from '@/components/comics/section-heading';
import type { ComicDTO } from '@/lib/types';

export function ComicGridSection({ title, comics, badge, showChapters = false, href }: { title: string; comics: ComicDTO[]; badge?: 'NEW' | 'END' | 'HOT'; showChapters?: boolean; href?: string }) {
  return (
    <section className="container py-8">
      <SectionHeading title={title} href={href} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} badge={badge} showChapters={showChapters} />
        ))}
      </div>
    </section>
  );
}
