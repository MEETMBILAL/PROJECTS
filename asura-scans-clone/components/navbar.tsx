"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Menu, Search, Trophy, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { SearchOverlay } from "@/components/search-overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/browse", label: "Browse" }
];

const resourceLinks = [
  { href: "/browse?type=novels", label: "Novels", icon: BookOpen },
  { href: "/browse", label: "Comics", icon: BookOpen },
  { href: "/leaderboard", label: "Users / Leaderboard", icon: Trophy }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[60px] border-b border-brand-surface bg-brand-nav/95 backdrop-blur transition-shadow duration-150",
          scrolled && "shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="container-shell flex h-full items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-textSecondary transition-colors duration-150 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-textSecondary transition-colors duration-150 hover:bg-brand-cardHover hover:text-white"
                aria-haspopup="menu"
              >
                Resources
                <ChevronDown className="h-4 w-4" aria-hidden />
              </button>
              <div className="invisible absolute right-0 top-full mt-2 w-56 translate-y-2 rounded-xl border border-brand-surface bg-brand-nav p-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {resourceLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-textSecondary transition-colors duration-150 hover:bg-brand-cardHover hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-brand-primary" aria-hidden />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" aria-hidden />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <UserRound className="h-4 w-4" aria-hidden />
                Login
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" aria-hidden />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[82vw] max-w-sm border-l border-brand-surface bg-brand-nav p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" aria-hidden />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2" aria-label="Mobile primary">
              {[...navLinks, ...resourceLinks].map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-transparent px-3 py-3 text-sm font-medium text-brand-textSecondary transition-colors duration-150 hover:border-brand-primary/40 hover:bg-brand-cardHover hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button asChild className="mt-6 w-full">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </Button>
          </aside>
        </div>
      )}

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
