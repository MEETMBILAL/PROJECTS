"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { BookOpen, ChevronDown, LogIn, Menu, Search, UserRound } from "lucide-react";

import { SearchOverlay } from "@/components/search/search-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/browse", label: "Browse" },
];

const resourceLinks = [
  { href: "/browse?type=MANGA", label: "Novels" },
  { href: "/browse", label: "Comics" },
  { href: "/leaderboard", label: "Users/Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium text-brand-secondary hover:bg-brand-hover hover:text-white",
            pathname === link.href && "text-white",
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[60px] border-b border-brand-surface bg-brand-nav/95 backdrop-blur",
        scrolled && "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="asura-container flex h-full items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Asura Scans home">
          <Image src="/logo.svg" alt="" width={36} height={36} className="rounded-lg" priority />
          <span className="text-base font-bold text-white sm:text-lg">Asura Scans</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-brand-secondary hover:bg-brand-hover hover:text-white">
                Resources <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-brand-surface bg-brand-card text-white">
              <DropdownMenuLabel>Explore</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-brand-surface" />
              {resourceLinks.map((link) => (
                <DropdownMenuItem key={link.label} asChild className="focus:bg-brand-hover focus:text-white">
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" aria-label="Open search" onClick={() => setSearchOpen(true)} className="hover:bg-brand-hover">
            <Search className="h-5 w-5" />
          </Button>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-brand-hover">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                    <AvatarFallback className="bg-brand-primary text-xs">{session.user.name?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate text-sm">{session.user.name ?? "Reader"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-brand-surface bg-brand-card text-white">
                <DropdownMenuItem asChild className="focus:bg-brand-hover focus:text-white">
                  <Link href="/bookmarks">Bookmarks</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="focus:bg-brand-hover focus:text-white">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()} className="gap-2 bg-brand-primary text-white hover:bg-brand-light">
              <LogIn className="h-4 w-4" /> Login
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open search" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-brand-surface bg-brand-nav text-white">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-brand-light" /> Asura Scans
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
                {links}
                {resourceLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="rounded-md px-3 py-2 text-sm text-brand-secondary hover:bg-brand-hover hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Button onClick={() => (session?.user ? signOut() : signIn())} className="mt-8 w-full bg-brand-primary hover:bg-brand-light">
                <UserRound className="mr-2 h-4 w-4" /> {session?.user ? "Sign out" : "Login"}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
