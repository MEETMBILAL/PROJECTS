import Link from 'next/link';

export function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="section-heading">{title}</h2>
      {href ? (
        <Link href={href} className="focus-purple rounded-md text-sm font-semibold text-brand-accent transition-colors hover:text-white">
          View all
        </Link>
      ) : null}
    </div>
  );
}
