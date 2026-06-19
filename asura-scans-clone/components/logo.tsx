import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Asura Scans home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary shadow-purple-glow">
        <span className="text-lg font-black text-white">A</span>
      </span>
      <span className="text-lg font-bold text-white">Asura Scans</span>
    </Link>
  );
}
