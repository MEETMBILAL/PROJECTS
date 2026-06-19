import Link from "next/link";

type SectionProps = {
  title: string;
  href?: string;
  children: React.ReactNode;
};

export function Section({ title, href, children }: SectionProps) {
  return (
    <section className="container-shell py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="section-heading">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-semibold text-brand-accent transition-colors duration-150 hover:text-white">
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
