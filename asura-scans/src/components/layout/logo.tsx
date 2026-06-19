import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="asura-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B06EF5" />
          <stop offset="100%" stopColor="#913FE2" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#asura-grad)" />
      <path
        d="M20 8l9 22h-5.4l-1.5-4h-4.2l-1.5 4H11L20 8zm0 9.5l-1.4 4h2.8L20 17.5z"
        fill="#fff"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-90 focus-glow rounded-md",
        className,
      )}
      aria-label="Asura Scans home"
    >
      <LogoMark />
      <span className="text-lg font-extrabold tracking-tight text-white">
        Asura<span className="text-brand-purple-light"> Scans</span>
      </span>
    </Link>
  );
}
