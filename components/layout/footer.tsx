import Image from 'next/image';
import Link from 'next/link';

const links = ['About', 'Discord', 'Twitter', 'Privacy Policy', 'DMCA'];

export function Footer() {
  return (
    <footer className="border-t border-brand-surface bg-brand-dark">
      <div className="container grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-2"><Image src="/asura-logo.svg" alt="" width={34} height={34} /><span className="text-lg font-black text-white">Asura Scans</span></div>
          <p className="text-sm leading-6 text-brand-secondary">A dark, fast manga and manhwa reader with trending titles, chapter tracking, search, and reader-first controls.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-secondary">
          {links.map((label) => <Link key={label} href="#" className="focus-purple rounded-md transition-colors hover:text-white">{label}</Link>)}
        </div>
      </div>
      <div className="border-t border-brand-surface py-4 text-center text-xs text-brand-muted">Copyright © {new Date().getFullYear()} Asura Scans Clone. For demo purposes.</div>
    </footer>
  );
}
