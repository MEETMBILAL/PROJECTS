"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  Bookmark,
  Compass,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { SearchOverlay } from "@/components/search/search-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/browse", label: "Browse", icon: Compass },
];

const RESOURCES = [
  { href: "/browse?type=MANHWA", label: "Novels", icon: BookOpen },
  { href: "/browse", label: "Comics", icon: Compass },
  { href: "/leaderboard", label: "Users / Leaderboard", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[60px] w-full border-b border-brand-surface bg-brand-nav/90 backdrop-blur-md transition-shadow duration-150",
          scrolled && "shadow-nav",
        )}
      >
        <nav className="container flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="rounded-md p-1 text-brand-text-secondary transition-colors hover:text-white md:hidden focus-glow"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          {/* Center nav (desktop) */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive(link.href)
                    ? "text-white"
                    : "text-brand-text-secondary hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-text-secondary transition-colors hover:text-white focus-glow">
                Resources
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {RESOURCES.map((r) => (
                  <DropdownMenuItem key={r.label} asChild>
                    <Link href={r.href}>
                      <r.icon /> {r.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white focus-glow"
            >
              <Search className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] animate-slide-in-right border-r border-brand-surface bg-brand-nav p-4 shadow-nav">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-brand-text-secondary hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-brand-purple/15 text-white"
                      : "text-brand-text-secondary hover:bg-brand-card-hover hover:text-white",
                  )}
                >
                  <link.icon className="h-5 w-5" /> {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-brand-surface" />
              <p className="px-3 py-1 text-xs font-semibold uppercase text-brand-text-muted">
                Resources
              </p>
              {RESOURCES.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
                >
                  <r.icon className="h-5 w-5" /> {r.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-brand-surface" />
              <Link
                href="/leaderboard"
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-brand-text-secondary transition-colors hover:bg-brand-card-hover hover:text-white"
              >
                <Trophy className="h-5 w-5" /> Leaderboard
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
