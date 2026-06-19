"use client";

import { BookOpen, ChevronDown, Menu, Search, Trophy, UserRound, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { SearchOverlay } from "@/components/search-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/browse", label: "Browse" },
];

const resources = [
  { href: "/browse?type=MANGA", label: "Comics", icon: BookOpen },
  { href: "/browse?genre=Fantasy", label: "Novels", icon: UserRound },
  { href: "/leaderboard", label: "Users / Leaderboard", icon: Trophy },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[60px] border-b border-brand-surface bg-brand-nav/90 backdrop-blur",
          scrolled && "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        )}
      >
        <div className="container-shell flex h-full items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Asura Scans home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary text-lg font-black text-white">A</span>
            <span className="hidden text-lg font-extrabold tracking-tight text-white sm:inline">Asura Scans</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-semibold text-brand-textSecondary hover:bg-brand-cardHover hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-brand-textSecondary hover:bg-brand-cardHover hover:text-white">
                Resources <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="invisible absolute right-0 top-full w-56 translate-y-2 rounded-xl border border-brand-surface bg-brand-card p-2 opacity-0 shadow-2xl group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {resources.map((resource) => (
                  <Link key={resource.href} href={resource.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-textSecondary hover:bg-brand-cardHover hover:text-white">
                    <resource.icon className="h-4 w-4" aria-hidden="true" />
                    {resource.label}
                  </Link>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" />
            </Button>
            {session?.user ? (
              <Avatar className="h-9 w-9 border border-brand-surface">
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                <AvatarFallback>{session.user.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <Button asChild size="sm">
                <Link href="/api/auth/signin">Login</Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="ml-auto h-full w-80 max-w-[88vw] border-l border-brand-surface bg-brand-nav p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold">Asura Scans</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2">
              {[...navLinks, ...resources].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-brand-surface px-4 py-3 font-semibold text-brand-textSecondary hover:bg-brand-cardHover hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6">
              {session?.user ? (
                <div className="flex items-center gap-3 rounded-lg bg-brand-card p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                    <AvatarFallback>{session.user.name?.charAt(0) ?? "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{session.user.name ?? session.user.email}</span>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/api/auth/signin">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
